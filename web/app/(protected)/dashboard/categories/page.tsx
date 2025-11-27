'use client';

import { useEffect, useState } from 'react';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { categoryService } from '@/lib/services/category.service';
import { projectService } from '@/lib/services/project.service';
import { Spinner } from '@/components/ui/spinner';
import { Modal } from '@/components/ui/modal';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { CategoryCard } from '@/components/features/categories/category-card';
import { CategoryForm } from '@/components/features/categories/category-form';
import { useSearch } from '@/hooks/use-search';
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
  const { query, setQuery, filtered: filteredCategories } = useSearch(categories, 'name');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [categoriesRes, projectsRes] = await Promise.all([
          categoryService.getMyCategories(),
          projectService.getMyProjects(),
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
      const response: any = await categoryService.create({
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
      const updated = await categoryService.update(editModal.id, {
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
      await categoryService.delete(deleteModal);
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
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
        <PageHeader
          icon={FileText}
          title="Categories"
          description="Manage your email categories"
          iconGradient="from-green-600 to-teal-600"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-lg hover:from-green-700 hover:to-teal-700 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap w-full sm:w-auto min-h-[44px]"
            >
              <Plus className="w-5 h-5" />
              <span>New Category</span>
            </button>
          }
        />

        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="🔍 Search categories..."
          resultCount={filteredCategories.length}
        />

        {filteredCategories.length === 0 ? (
          <EmptyState message="No categories found" />
        ) : (
          <div className="grid gap-4">
            {filteredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onEdit={(cat) => {
                  setEditModal(cat);
                  setForm({ name: cat.name, description: cat.description || '', projectId: cat.projectId.toString() });
                }}
                onDelete={setDeleteModal}
              />
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Category">
        <CategoryForm
          form={form}
          projects={projects}
          loading={creating}
          onSubmit={handleCreate}
          onChange={(field, value) => setForm({ ...form, [field]: value })}
        />
      </Modal>

      <Modal
        isOpen={!!editModal}
        onClose={() => {
          setEditModal(null);
          setForm({ name: '', description: '', projectId: '' });
        }}
        title="Edit Category"
      >
        <CategoryForm
          form={form}
          projects={projects}
          loading={updating}
          isEdit
          onSubmit={handleUpdate}
          onChange={(field, value) => setForm({ ...form, [field]: value })}
        />
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteModal}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        title="Delete Category"
        message="Are you sure you want to delete this category? All templates inside will be deleted too."
        confirmText="Delete"
        confirmIcon={Trash2}
        loading={deleting}
      />
    </div>
  );
}
