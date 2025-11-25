'use client';

import { useEffect, useState } from 'react';
import { FileText, Calendar, Plus, X, Trash2, Edit2, FolderOpen } from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { Spinner } from '@/components/ui/spinner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import type { Category, Project, ApiError } from '@/lib/api/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [form, setForm] = useState({ name: '', description: '', projectId: '' });
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, projectsRes] = await Promise.all([
          apiClient.get<Category[]>(API_ENDPOINTS.CATEGORY.MY_CATEGORIES),
          apiClient.get<Project[]>(API_ENDPOINTS.PROJECT.MY_PROJECTS),
        ]);
        setCategories(categoriesRes);
        setProjects(projectsRes);
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
    if (!form.name.trim() || !form.projectId) {
      toast.error('Name and project are required');
      return;
    }

    setCreating(true);
    try {
      const response: any = await apiClient.post(API_ENDPOINTS.CATEGORY.CREATE, {
        name: form.name,
        description: form.description,
        projectId: parseInt(form.projectId),
      });
      toast.success('Category created successfully!');
      setCategories([...categories, response.category]);
      setForm({ name: '', description: '', projectId: '' });
      setIsModalOpen(false);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editModal) return;

    setUpdating(true);
    try {
      const updated = await apiClient.patch(API_ENDPOINTS.CATEGORY.UPDATE(editModal.id), {
        name: form.name,
        description: form.description,
      });
      setCategories(categories.map((c) => (c.id === editModal.id ? { ...c, ...updated } : c)));
      toast.success('Category updated successfully!');
      setEditModal(null);
      setForm({ name: '', description: '', projectId: '' });
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to update category');
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeleting(true);
    try {
      await apiClient.delete(API_ENDPOINTS.CATEGORY.DELETE(deleteModal));
      setCategories(categories.filter((c) => c.id !== deleteModal));
      toast.success('Category deleted successfully!');
      setDeleteModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to delete category');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-600 to-teal-600 flex items-center justify-center shadow-lg">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories</h1>
              <p className="text-gray-600">Manage your email categories</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg"
          >
            <Plus className="w-5 h-5" />
            New Category
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredCategories.length} categories
          </div>
          <input
            type="text"
            placeholder="🔍 Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 w-64"
          />
        </div>

        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((category) => {
              return (
                <div
                  key={category.id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditModal(category);
                          setForm({ name: category.name, description: category.description || '', projectId: category.projectId.toString() });
                        }}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteModal(category.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-gray-500 mt-4">
                    <div className="flex items-center gap-2">
                      <FolderOpen className="w-4 h-4" />
                      <span>{category.project?.title || 'Unknown Project'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(category.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New Category</h2>
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
                placeholder="Category name"
                disabled={creating}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Category description"
                  disabled={creating}
                  rows={3}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  disabled={creating}
                >
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>
                      {project.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button type="submit" loading={creating} loadingText="Creating..." icon={Plus}>
                Create Category
              </Button>
            </form>
          </div>
        </div>
      )}

      {editModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Edit Category</h2>
              <button
                onClick={() => {
                  setEditModal(null);
                  setForm({ name: '', description: '', projectId: '' });
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4">
              <Input
                label="Name"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Category name"
                disabled={updating}
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Category description"
                  disabled={updating}
                  rows={3}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <Button type="submit" loading={updating} loadingText="Updating..." icon={Edit2}>
                Update Category
              </Button>
            </form>
          </div>
        </div>
      )}

      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Delete Category</h2>
              <button
                onClick={() => setDeleteModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this category? All templates inside will be deleted too.
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
