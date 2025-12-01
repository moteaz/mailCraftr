'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/spinner';
import { MESSAGES } from '@/constants';
import type { Template, ApiError } from '@/types';
import { useTemplates } from '@/features/templates/hooks/useTemplates';
import { useTemplateFilters } from '@/features/templates/hooks/useTemplateFilters';
import { usePDFExport } from '@/features/templates/hooks/usePDFExport';
import { parsePlaceholders, replacePlaceholders } from '@/features/templates/utils/templateHelpers';
import { PageHeader } from '@/features/templates/components/ui/PageHeader';
import { FilterBar } from '@/features/templates/components/ui/FilterBar';
import { TemplateList } from '@/features/templates/components/sections/TemplateList';
import { CreateTemplateModal } from '@/features/templates/components/modals/CreateTemplateModal';
import { EditTemplateModal } from '@/features/templates/components/modals/EditTemplateModal';
import { DeleteTemplateModal } from '@/features/templates/components/modals/DeleteTemplateModal';
import { PreviewModal } from '@/features/templates/components/modals/PreviewModal';

export default function TemplatesPage() {
  const { templates, setTemplates, categories, loading, createTemplate, updateTemplate, deleteTemplate } = useTemplates();
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, filteredTemplates, clearFilters, hasActiveFilters } = useTemplateFilters(templates);
  const { downloadPDF } = usePDFExport();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<Template | null>(null);
  const [deleteModal, setDeleteModal] = useState<number | null>(null);
  const [editContent, setEditContent] = useState('');
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const handleCreate = async (form: any) => {
    setCreating(true);
    try {
      const validPlaceholders = form.placeholders.filter((p: any) => p.key.trim() !== '');
      const payload = {
        name: form.name,
        description: form.description,
        content: '',
        categorieId: parseInt(form.categorieId),
        placeholders: validPlaceholders,
      };
      
      const newTemplateData = await createTemplate(payload);
      toast.success(MESSAGES.SUCCESS.TEMPLATE_CREATED);
      
      const category = categories.find(c => c.id === parseInt(form.categorieId));
      const newTemplate = {
        ...newTemplateData,
        placeholders: validPlaceholders,
        categorie: category ? { id: category.id, name: category.name } : null,
      };
      
      setTemplates([...templates, newTemplate]);
      setIsModalOpen(false);
      setEditModal(newTemplate);
      setEditContent('<p></p>');
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.CREATE_FAILED);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (!editModal || !editContent.trim()) {
      toast.error(MESSAGES.ERROR.REQUIRED_FIELDS);
      return;
    }

    setUpdating(true);
    try {
      const response: any = await updateTemplate(editModal.id, editContent);
      const updatedTemplate = {
        ...response,
        placeholders: editModal.placeholders,
        categorie: editModal.categorie,
      };
      setTemplates(templates.map((t) => (t.id === editModal.id ? updatedTemplate : t)));
      toast.success(MESSAGES.SUCCESS.TEMPLATE_UPDATED);
      setEditModal(null);
      setEditContent('');
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.UPDATE_FAILED);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;

    setDeleting(true);
    try {
      await deleteTemplate(deleteModal);
      toast.success(MESSAGES.SUCCESS.TEMPLATE_DELETED);
      setDeleteModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.DELETE_FAILED);
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = (template: Template) => {
    const placeholders = parsePlaceholders(template.placeholders);
    setEditModal({ ...template, placeholders });
    setEditContent(template.content || '<p></p>');
  };

  const handleDownloadPDF = async () => {
    if (!editModal) return;
    const content = replacePlaceholders(editContent, editModal.placeholders);
    await downloadPDF(content, editModal.name);
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
        <PageHeader onCreateClick={() => setIsModalOpen(true)} />
        
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          categories={categories}
          resultCount={filteredTemplates.length}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />

        <TemplateList
          templates={filteredTemplates}
          onEdit={handleEdit}
          onDelete={(id) => setDeleteModal(id)}
          onCreateClick={() => setIsModalOpen(true)}
        />
      </div>

      <CreateTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onCreate={handleCreate}
      />

      <EditTemplateModal
        template={editModal}
        content={editContent}
        onContentChange={setEditContent}
        onClose={() => {
          setEditModal(null);
          setEditContent('');
        }}
        onSave={handleUpdate}
        onDownloadPDF={handleDownloadPDF}
        onShowPreview={() => setShowPreviewModal(true)}
        updating={updating}
      />

      <PreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        content={editContent && editModal ? replacePlaceholders(editContent, editModal.placeholders) : ''}
        onDownloadPDF={handleDownloadPDF}
      />

      <DeleteTemplateModal
        isOpen={deleteModal !== null}
        onClose={() => setDeleteModal(null)}
        onConfirm={handleDelete}
        deleting={deleting}
      />
    </div>
  );
}
