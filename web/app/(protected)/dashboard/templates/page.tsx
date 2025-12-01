'use client';

import { useEffect, useState } from 'react';
import { LayoutTemplate, Plus, X, Trash2, Edit2, FileText, Download } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { toast } from 'sonner';
import type { Template, Category, ApiError } from '@/lib/api/types';

export default function TemplatesPage() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<Template | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: '',
    description: '',
    categorieId: '',
    placeholders: [] as { key: string; value: string }[],
  });
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [editContent, setEditContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const filteredTemplates = templates.filter((t) => {
    const matchesSearch = t.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || t.categorieId === parseInt(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATE.MY_TEMPLATES),
          apiClient.get<Category[]>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
        ]);
        const parsedTemplates = templatesRes.map(t => ({
          ...t,
          placeholders: typeof t.placeholders === 'string' 
            ? JSON.parse(t.placeholders) 
            : Array.isArray(t.placeholders) ? t.placeholders : []
        }));
        setTemplates(parsedTemplates);
        setCategories(categoriesRes);
      } catch (err) {
        const error = err as ApiError;
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.categorieId) {
      toast.error('Name and category are required');
      return;
    }

    setCreating(true);
    try {
      const validPlaceholders = form.placeholders.filter(p => p.key.trim() !== '');
      
      const payload = {
        name: form.name,
        description: form.description,
        content: '',
        categorieId: parseInt(form.categorieId),
        placeholders: validPlaceholders,
      };
      
      const response: any = await apiClient.post(API_ENDPOINTS.TEMPLATE.CREATE, payload);
      toast.success('Template created! Now add content.');
      const category = categories.find(c => c.id === parseInt(form.categorieId));
      const newTemplate = {
        ...response.template,
        placeholders: validPlaceholders,
        categorie: category ? { id: category.id, name: category.name } : null,
      };
      setTemplates([...templates, newTemplate]);
      setForm({ name: '', description: '', categorieId: '', placeholders: [] });
      setIsModalOpen(false);
      setEditModal(newTemplate);
      setEditContent('<p></p>');
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to create template');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editModal || !editContent.trim()) {
      toast.error('Content is required');
      return;
    }

    setUpdating(true);
    try {
      const response: any = await apiClient.patch(API_ENDPOINTS.TEMPLATE.UPDATE(editModal.id), {
        content: editContent,
      });
      const updatedTemplate = {
        ...response,
        placeholders: editModal.placeholders,
        categorie: editModal.categorie,
      };
      setTemplates(templates.map((t) => (t.id === editModal.id ? updatedTemplate : t)));
      toast.success('Template updated successfully!');
      setEditModal(null);
      setEditContent('');
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to update template');
    } finally {
      setUpdating(false);
    }
  };

  const insertPlaceholder = (key: string) => {
    const placeholder = `{{${key}}}`;
    const editor = (window as any).__tiptapEditor;
    if (editor) {
      editor.chain().focus().insertContent(placeholder).run();
    }
  };

  const downloadPDF = async () => {
    if (!editModal) return;

    try {
      const pdf = new jsPDF();
      const content = replacePlaceholders(editContent, editModal.placeholders);
      
      // Create temporary div for rendering
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      tempDiv.style.padding = '20px';
      tempDiv.style.width = '190mm';
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      document.body.appendChild(tempDiv);

      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        backgroundColor: '#ffffff',
      });

      document.body.removeChild(tempDiv);

      const imgData = canvas.toDataURL('image/png');
      const imgWidth = 190;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save(`${editModal.name}.pdf`);
      toast.success('PDF downloaded successfully!');
    } catch (err) {
      console.error('PDF generation error:', err);
      toast.error('Failed to generate PDF');
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeleting(true);
    try {
      await apiClient.delete(API_ENDPOINTS.TEMPLATE.DELETE(deleteModal));
      setTemplates(templates.filter((t) => t.id !== deleteModal));
      toast.success('Template deleted successfully!');
      setDeleteModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to delete template');
    } finally {
      setDeleting(false);
    }
  };

  const handleJsonUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.json')) {
      toast.error('Please upload a valid JSON file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const placeholders = Object.entries(json).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setForm({ ...form, placeholders });
        setJsonFile(file);
        toast.success(`Loaded ${placeholders.length} placeholders from JSON`);
      } catch (err) {
        toast.error('Invalid JSON file format');
      }
    };
    reader.readAsText(file);
  };

  const replacePlaceholders = (content: string, placeholders: { key: string; value: string }[]) => {
    let result = content;
    if (Array.isArray(placeholders) && placeholders.length > 0) {
      placeholders.forEach((p) => {
        if (p && p.key && p.value) {
          result = result.replace(new RegExp(`{{${p.key}}}`, 'g'), p.value);
        }
      });
    }
    return result;
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg flex-shrink-0">
              <LayoutTemplate className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-xs sm:text-base text-gray-600">Manage your email templates</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap w-full sm:w-auto min-h-[44px]"
          >
            <Plus className="w-5 h-5" />
            New Template
          </button>
        </div>

        <div className="mb-6 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search templates by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-sm"
              />
              <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base bg-white w-full sm:w-56 min-h-[44px] appearance-none cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 [&>option]:py-3 [&>option]:text-base"
            >
              <option value="all" className="py-3 text-base">📁 All Categories</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="py-3 text-base">
                  📂 {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {filteredTemplates.length === 0 ? 'No templates found' : 
               filteredTemplates.length === 1 ? '1 template' : 
               `${filteredTemplates.length} templates`}
            </p>
            {(searchQuery || selectedCategory !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <LayoutTemplate className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No templates found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your filters or create a new template</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg text-sm"
            >
              <Plus className="w-4 h-4" />
              Create Template
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer bg-white"
                onClick={() => {
                  let placeholders = [];
                  if (typeof template.placeholders === 'string') {
                    try {
                      const parsed = JSON.parse(template.placeholders);
                      placeholders = Array.isArray(parsed) ? parsed : [];
                    } catch (e) {
                      placeholders = [];
                    }
                  } else if (Array.isArray(template.placeholders)) {
                    placeholders = template.placeholders;
                  }
                  placeholders = placeholders.filter(p => p && p.key && p.value);
                  
                  setEditModal({
                    ...template,
                    placeholders,
                  });
                  setEditContent(template.content || '<p></p>');
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
                        <FileText className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">{template.name}</h3>
                        {template.description && (
                          <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">{template.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteModal(template.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
                    title="Delete template"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
                  {template.categorie?.name && (
                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                      <span className="font-medium">📂</span>
                      <span>{template.categorie.name}</span>
                    </div>
                  )}
                  {Array.isArray(template.placeholders) && template.placeholders.length > 0 && (
                    <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg">
                      <span className="font-medium">{template.placeholders.length}</span>
                      <span>placeholder{template.placeholders.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                  <div className="ml-auto text-xs text-gray-400 group-hover:text-orange-600 transition-colors">
                    Click to edit →
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Template</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Template name"
                disabled={creating}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Template description"
                  disabled={creating}
                  rows={2}
                  className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.categorieId}
                  onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
                  className="block w-full px-3 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-base min-h-[44px] appearance-none bg-white cursor-pointer bg-[url('data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%236b7280\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.5rem_center] bg-no-repeat pr-10 [&>option]:py-3 [&>option]:text-base"
                  disabled={creating}
                >
                  <option value="" className="py-3 text-base">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id} className="py-3 text-base">
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders (JSON File)</label>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleJsonUpload}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                  disabled={creating}
                />
                {form.placeholders.length > 0 && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg max-h-48 overflow-y-auto">
                    <p className="text-sm font-medium text-gray-700 mb-2">Loaded {form.placeholders.length} Placeholders:</p>
                    <div className="space-y-1">
                      {form.placeholders.map((p, i) => (
                        <div key={i} className="text-xs text-gray-600 font-mono">
                          {`{{${p.key}}}`} = {p.value}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Upload a JSON file with key-value pairs (e.g., {`{"name": "John", "email": "john@example.com"}`})
                </p>
              </div>

              <Button type="submit" loading={creating} loadingText="Creating..." icon={Plus}>
                Create Template
              </Button>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/70 backdrop-blur-md flex items-center justify-center z-50 p-0 sm:p-3 animate-in fade-in duration-200">
          <div className="bg-white rounded-none sm:rounded-3xl shadow-2xl w-full h-full sm:h-[96vh] sm:max-w-[98vw] lg:max-w-[90vw] xl:max-w-[85vw] flex flex-col overflow-hidden border-0 sm:border border-gray-200/50">
            {/* Enhanced Header - Hidden in Fullscreen */}
            {!isFullscreen && (
              <div className="relative bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-[1px]">
                <div className="bg-white rounded-t-none sm:rounded-t-3xl">
                  <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="relative">
                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 flex items-center justify-center shadow-lg">
                          <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h2 className="text-base sm:text-lg font-bold text-gray-900 truncate flex items-center gap-2">
                          {editModal.name}
                          <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">Editing</span>
                        </h2>
                        {editModal.description && (
                          <p className="text-xs text-gray-600 truncate mt-0.5">{editModal.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={downloadPDF}
                        className="hidden sm:flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all duration-200 shadow-sm hover:shadow"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                        <span className="hidden lg:inline">Export</span>
                      </button>
                      <button
                        onClick={() => {
                          setEditModal(null);
                          setEditContent('');
                        }}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 group"
                        aria-label="Close editor"
                      >
                        <X className="w-5 h-5 text-gray-500 group-hover:text-gray-900 transition-colors" />
                      </button>
                    </div>
                  </div>
                  <div className="px-4 sm:px-6 pb-3 flex items-center gap-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                      <span>Auto-save</span>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <span>{editModal.placeholders?.length || 0} variables</span>
                    </div>
                    <div className="hidden md:flex items-center gap-1.5 ml-auto">
                      <kbd className="px-2 py-0.5 bg-gray-100 rounded text-xs font-mono">Ctrl+S</kbd>
                      <span>to save</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 3-Column Layout */}
            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row bg-gray-50">
              
              {/* Left: Variables */}
              <div className={`w-full lg:w-72 xl:w-80 border-b lg:border-b-0 lg:border-r border-gray-200 bg-white flex flex-col max-h-[30vh] lg:max-h-none transition-all duration-300 ${isFullscreen ? 'lg:w-64 xl:w-72' : ''}`}>
                <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    🏷️ Variables
                    <span className="ml-auto text-xs font-normal text-gray-500">{editModal.placeholders?.length || 0}</span>
                  </h3>
                  <p className="text-xs text-gray-600 mt-1">Click to insert</p>
                </div>
                <div className="flex-1 overflow-y-auto p-3 space-y-2">
                  {!editModal.placeholders || editModal.placeholders.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <span className="text-2xl">📝</span>
                      </div>
                      <p className="text-sm text-gray-500">No variables</p>
                    </div>
                  ) : (
                    editModal.placeholders.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => insertPlaceholder(p.key)}
                        className="w-full text-left p-3 bg-gradient-to-br from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100 border border-orange-200/50 rounded-xl transition-all duration-200 group hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <code className="font-mono text-xs font-bold text-orange-700 break-all">{`{{${p.key}}}`}</code>
                          <span className="text-xs text-orange-600 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">→</span>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">{p.value || 'No preview'}</p>
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Center: Editor */}
              <div className={`flex-1 flex flex-col overflow-hidden bg-white transition-all duration-300 ${isFullscreen ? 'lg:flex-[2]' : ''}`}>
                <div className="px-4 sm:px-6 py-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">✍️ Editor</h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setShowPreviewModal(true)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                      title="Show preview"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span className="hidden sm:inline">Preview</span>
                    </button>
                    <button
                      onClick={() => setIsFullscreen(!isFullscreen)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-700 bg-white hover:bg-gray-100 rounded-lg transition-all duration-200 border border-gray-200"
                      title={isFullscreen ? "Exit fullscreen" : "Fullscreen mode"}
                    >
                      {isFullscreen ? (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          <span className="hidden sm:inline">Exit</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                          </svg>
                          <span className="hidden sm:inline">Expand</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                  <div className="max-w-4xl mx-auto">
                    <RichTextEditor
                      content={editContent}
                      onChange={setEditContent}
                      placeholder="Start writing..."
                    />
                  </div>
                </div>
              </div>


            </div>

            {/* Footer - Hidden in Fullscreen */}
            {!isFullscreen && (
              <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 flex-shrink-0">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <div className="hidden sm:flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                    <span>Last saved: Just now</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end">
                  <Button
                    onClick={() => {
                      setEditModal(null);
                      setEditContent('');
                    }}
                    variant="secondary"
                    className="flex-1 sm:flex-initial min-w-[100px]"
                    disabled={updating}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUpdate}
                    loading={updating}
                    loadingText="Saving..."
                    icon={Edit2}
                    className="flex-1 sm:flex-initial min-w-[120px] bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                👁️ Preview
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-200"
                >
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Download PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close preview"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div 
                id="pdf-preview"
                className="bg-white rounded-xl border border-gray-200 p-8 shadow-sm min-h-[400px] prose prose-base max-w-none mx-auto"
                dangerouslySetInnerHTML={{
                  __html: editContent ? replacePlaceholders(editContent, editModal.placeholders) : '<div class="flex flex-col items-center justify-center py-12 text-center"><div class="w-20 h-20 mb-4 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center"><span class="text-3xl">📄</span></div><p class="text-gray-400 text-base">No content to preview</p></div>'
                }}
              />
            </div>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Delete Template</h2>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this template? This action cannot be undone.
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => setDeleteModal(null)}
                variant="secondary"
                className="flex-1"
                disabled={deleting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDelete}
                variant="danger"
                loading={deleting}
                loadingText="Deleting..."
                icon={Trash2}
                className="flex-1"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
