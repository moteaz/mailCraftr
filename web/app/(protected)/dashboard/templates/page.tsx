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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{editModal.name}</h2>
                {editModal.description && (
                  <p className="text-sm text-gray-600 mt-1">{editModal.description}</p>
                )}
              </div>
              <button
                onClick={() => {
                  setEditModal(null);
                  setEditContent('');
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Editor</label>
                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Write your template content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders ({editModal.placeholders?.length || 0})</label>
                <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2">
                  {!editModal.placeholders || editModal.placeholders.length === 0 ? (
                    <p className="text-sm text-gray-500">No placeholders defined</p>
                  ) : (
                    editModal.placeholders.map((p, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => insertPlaceholder(p.key)}
                        className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 rounded-lg transition-colors group"
                      >
                        <div className="font-mono text-sm text-orange-700 font-semibold group-hover:text-orange-800">
                          {`{{${p.key}}}`}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">{p.value || 'No default value'}</div>
                        <div className="text-xs text-orange-600 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Click to insert
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Preview</label>
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="flex items-center gap-2 px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
              <div 
                id="pdf-preview"
                className="p-4 bg-white rounded-lg border border-gray-200 text-sm min-h-32 prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: editContent ? replacePlaceholders(editContent, editModal.placeholders) : '<p class="text-gray-400">Preview will appear here...</p>'
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={() => {
                  setEditModal(null);
                  setEditContent('');
                }}
                variant="secondary"
                className="flex-1"
                disabled={updating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdate}
                loading={updating}
                loadingText="Saving..."
                icon={Edit2}
                className="flex-1"
              >
                Save Template
              </Button>
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
