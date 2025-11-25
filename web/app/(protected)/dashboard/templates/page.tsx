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
  const [editContent, setEditContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTemplates = templates.filter((t) =>
    t.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, categoriesRes] = await Promise.all([
          apiClient.get<Template[]>(API_ENDPOINTS.TEMPLATE.MY_TEMPLATES),
          apiClient.get<Category[]>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
        ]);
        setTemplates(templatesRes);
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
      
      const response: any = await apiClient.post(API_ENDPOINTS.TEMPLATE.CREATE, {
        name: form.name,
        description: form.description,
        content: '',
        categorieId: parseInt(form.categorieId),
        placeholders: validPlaceholders,
      });
      toast.success('Template created! Now add content.');
      const newTemplate = {
        ...response.template,
        placeholders: validPlaceholders,
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
      const response: any = await apiClient.Patch(API_ENDPOINTS.TEMPLATE.UPDATE(editModal.id), {
        content: editContent,
      });
      setTemplates(templates.map((t) => (t.id === editModal.id ? response : t)));
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

  const addPlaceholder = () => {
    setForm({ ...form, placeholders: [...form.placeholders, { key: '', value: '' }] });
  };

  const removePlaceholder = (index: number) => {
    setForm({ ...form, placeholders: form.placeholders.filter((_, i) => i !== index) });
  };

  const updatePlaceholder = (index: number, field: 'key' | 'value', value: string) => {
    const updated = [...form.placeholders];
    updated[index][field] = value;
    setForm({ ...form, placeholders: updated });
  };

  const replacePlaceholders = (content: string, placeholders: { key: string; value: string }[]) => {
    let result = content;
    placeholders.forEach((p) => {
      result = result.replace(new RegExp(`{{${p.key}}}`, 'g'), p.value);
    });
    return result;
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-600 to-red-600 flex items-center justify-center shadow-lg">
              <LayoutTemplate className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
              <p className="text-gray-600">Manage your email templates</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-lg hover:from-orange-700 hover:to-red-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Template
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredTemplates.length} templates
          </div>
          <input
            type="text"
            placeholder="🔍 Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 w-64"
          />
        </div>

        {filteredTemplates.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No templates found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  setEditModal({
                    ...template,
                    placeholders: Array.isArray(template.placeholders) ? template.placeholders : [],
                  });
                  setEditContent(template.content || '<p></p>');
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{template.description}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDeleteModal(template.id);
                      }}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500 mt-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    <span>{template.categorie?.name || 'Unknown Category'}</span>
                  </div>
                  {template.placeholders.length > 0 && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs">
                      {template.placeholders.length} placeholders
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 my-8">
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
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={form.categorieId}
                  onChange={(e) => setForm({ ...form, categorieId: e.target.value })}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                  disabled={creating}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-gray-700">Placeholders</label>
                  <button
                    type="button"
                    onClick={addPlaceholder}
                    className="text-sm text-orange-600 hover:text-orange-700"
                  >
                    + Add Placeholder
                  </button>
                </div>
                {form.placeholders.map((p, i) => (
                  <div key={i} className="flex gap-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key (e.g., name)"
                      value={p.key}
                      onChange={(e) => updatePlaceholder(i, 'key', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <input
                      type="text"
                      placeholder="Default value"
                      value={p.value}
                      onChange={(e) => updatePlaceholder(i, 'value', e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                      type="button"
                      onClick={() => removePlaceholder(i)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              <Button type="submit" loading={creating} loadingText="Creating..." icon={Plus}>
                Create Template
              </Button>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full p-6 my-8">
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

            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content Editor</label>
                <RichTextEditor
                  content={editContent}
                  onChange={setEditContent}
                  placeholder="Write your template content here..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Placeholders</label>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {editModal.placeholders.length === 0 ? (
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
                        <div className="text-xs text-gray-600 mt-1">{p.value}</div>
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

            <div className="flex gap-3">
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
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

            <div className="flex gap-3">
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
