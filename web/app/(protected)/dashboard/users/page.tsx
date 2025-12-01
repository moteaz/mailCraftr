'use client';

import { useState } from 'react';
import { UserPlus, Users as UsersIcon } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/ui/pagination';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { UserCard } from '@/features/users/components/UserCard';
import { CreateUserModal } from '@/features/users/components/CreateUserModal';
import { useUsers } from '@/features/users/hooks/useUsers';
import { toast } from 'sonner';
import { MESSAGES } from '@/constants';
import type { ApiError } from '@/types';

export default function UsersPage() {
  const { users, projects, loading, currentPage, totalPages, createUser, deleteUser, loadPage } = useUsers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreate = async (data: { email: string; password: string; projectIds: string[] }) => {
    try {
      await createUser(data);
      toast.success(MESSAGES.SUCCESS.USER_CREATED);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.CREATE_FAILED);
      throw err;
    }
  };

  const handleDelete = async () => {
    if (!deleteUserModal) return;

    setDeletingUser(true);
    try {
      await deleteUser(deleteUserModal);
      toast.success(MESSAGES.SUCCESS.USER_DELETED);
      setDeleteUserModal(null);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || MESSAGES.ERROR.DELETE_FAILED);
    } finally {
      setDeletingUser(false);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200">
        <PageHeader
          icon={UsersIcon}
          title="Users"
          description="Manage system users"
          iconGradient="from-blue-600 to-indigo-600"
          action={
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-sm sm:text-base whitespace-nowrap w-full sm:w-auto min-h-[44px]"
            >
              <UserPlus className="w-5 h-5" />
              New User
            </button>
          }
        />

        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="🔍 Search users by email..."
          resultCount={filteredUsers.length}
        />

        {filteredUsers.length === 0 ? (
          <EmptyState message="No users found" icon={UsersIcon} />
        ) : (
          <>
            <div className="grid gap-3 sm:gap-4">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onDelete={user.role !== 'SUPERADMIN' ? () => setDeleteUserModal(user.id) : undefined}
                />
              ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={loadPage}
            />
          </>
        )}
      </div>

      <CreateUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projects={projects}
        onCreate={handleCreate}
      />

      <ConfirmDialog
        isOpen={!!deleteUserModal}
        onClose={() => setDeleteUserModal(null)}
        onConfirm={handleDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        loading={deletingUser}
      />
    </div>
  );
}
