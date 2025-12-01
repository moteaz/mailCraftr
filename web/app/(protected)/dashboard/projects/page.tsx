'use client';

import { useState } from 'react';
import { FolderOpen, Plus, Trash2 } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { ProjectCard } from '@/features/projects/components/ProjectCard';
import { CreateProjectModal } from '@/features/projects/components/CreateProjectModal';
import { AddUserModal } from '@/features/projects/components/AddUserModal';
import { useProjects } from '@/features/projects/hooks/useProjects';
import { useAuth } from '@/hooks/use-auth';
import { toast } from 'sonner';
import { MESSAGES } from '@/constants';
import type { ApiError } from '@/types';

export default function ProjectsListPage() {
  const { user } = useAuth();
  const { projects, users, loading, createProject, deleteProject, addUserToProject, removeUserFromProject } = useProjects(user?.role);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addUserModal, setAddUserModal] = useState<number | null>(null);
  const [deleteUserModal, setDeleteUserModal] = useState<{ projectId: number; email: string } | null>(null);
  const [deleteProjectModal, setDeleteProjectModal] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: { title: string; description: string; email: string[] }) => {
    try {
      await createProject(data);
      toast.success(MESSAGES.SUCCESS.PROJECT_CREATED);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.CREATE_FAILED);
      throw err;
    }
  };

  const handleAddUser = async (email: string) => {
    if (!addUserModal) return;
    try {
      await addUserToProject(addUserModal, email);
      toast.success(MESSAGES.SUCCESS.USER_ADDED);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.CREATE_FAILED);
      throw err;
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserModal) return;

    setDeletingUser(true);
    try {
      await removeUserFromProject(deleteUserModal.projectId, deleteUserModal.email);
      toast.success(MESSAGES.SUCCESS.USER_REMOVED);
      setDeleteUserModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.DELETE_FAILED);
    } finally {
      setDeletingUser(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectModal) return;

    setDeletingProject(true);
    try {
      await deleteProject(deleteProjectModal);
      toast.success(MESSAGES.SUCCESS.PROJECT_DELETED);
      setDeleteProjectModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.DELETE_FAILED);
    } finally {
      setDeletingProject(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
        <PageHeader
          icon={FolderOpen}
          title="Projects"
          description="Manage your projects"
          iconGradient="from-purple-600 to-pink-600"
          action={
            user?.role === 'SUPERADMIN' ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap w-full sm:w-auto min-h-[44px]"
              >
                <Plus className="w-5 h-5" />
                New Project
              </button>
            ) : undefined
          }
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder=" Search projects by title..."
          resultCount={filteredProjects.length}
        />

        {filteredProjects.length === 0 ? (
          <EmptyState message="No projects found" icon={FolderOpen} />
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                isExpanded={expandedProject === project.id}
                onToggleExpand={() => setExpandedProject(expandedProject === project.id ? null : project.id)}
                onDelete={user?.role === 'SUPERADMIN' ? () => setDeleteProjectModal(project.id) : undefined}
                onAddUser={user?.role === 'SUPERADMIN' ? () => setAddUserModal(project.id) : undefined}
                onRemoveUser={user?.role === 'SUPERADMIN' ? (email) => setDeleteUserModal({ projectId: project.id, email }) : undefined}
                isSuperAdmin={user?.role === 'SUPERADMIN'}
              />
            ))}
          </div>
        )}
      </div>

      {user?.role === 'SUPERADMIN' && (
        <>
          <CreateProjectModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            users={users}
            onCreate={handleCreate}
          />

          <AddUserModal
            isOpen={!!addUserModal}
            onClose={() => setAddUserModal(null)}
            onAdd={handleAddUser}
          />

          <ConfirmDialog
            isOpen={!!deleteUserModal}
            onClose={() => setDeleteUserModal(null)}
            onConfirm={handleDeleteUser}
            title="Remove User"
            message={`Are you sure you want to remove ${deleteUserModal?.email} from this project?`}
            confirmText="Remove"
            confirmIcon={Trash2}
            loading={deletingUser}
          />

          <ConfirmDialog
            isOpen={!!deleteProjectModal}
            onClose={() => setDeleteProjectModal(null)}
            onConfirm={handleDeleteProject}
            title="Delete Project"
            message="Are you sure you want to delete this project? This action cannot be undone."
            confirmText="Delete"
            confirmIcon={Trash2}
            loading={deletingProject}
          />
        </>
      )}
    </div>
  );
}
