'use client';

import { useEffect, useState } from 'react';
import { Mail, Lock, UserPlus, Users as UsersIcon, X, Trash2, User, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Pagination } from '@/components/ui/pagination';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/endpoints';
import { validators, validationMessages } from '@/lib/utils/validators';
import { toast } from 'sonner';
import type { User, ApiError } from '@/lib/api/types';

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', projectIds: [] as string[] });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [creating, setCreating] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState<number | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [searchProject, setSearchProject] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const limit = 10;

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadUsers = async (page: number = 1) => {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.USER.PAGINATED(page, limit));
      setUsers(response.data);
      setTotalPages(response.meta.totalPages);
      setTotal(response.meta.total);
      setCurrentPage(page);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to load users');
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [_, projectsRes] = await Promise.all([
          loadUsers(1),
          apiClient.get<any>(API_ENDPOINTS.PROJECT.LIST),
        ]);
        setProjects(Array.isArray(projectsRes) ? projectsRes : projectsRes.data || []);
      } catch (err) {
        const error = err as ApiError;
        toast.error(error.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: typeof errors = {};

    if (!form.email) {
      newErrors.email = validationMessages.email.required;
    } else if (!validators.email(form.email)) {
      newErrors.email = validationMessages.email.invalid;
    }

    if (!form.password) {
      newErrors.password = validationMessages.password.required;
    } else if (!validators.password(form.password, 8)) {
      newErrors.password = validationMessages.password.tooShort(8);
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setCreating(true);
    try {
      const userData = { email: form.email, password: form.password };
      await apiClient.post(API_ENDPOINTS.USER.CREATE, userData);
      
      for (const projectId of form.projectIds) {
        await apiClient.post(`/project/${projectId}/add-user`, { email: form.email });
      }
      
      toast.success('User created successfully!');
      setForm({ email: '', password: '', projectIds: [] });
      setSearchProject('');
      setIsModalOpen(false);
      await loadUsers(currentPage);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to create user');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserModal) return;

    setDeletingUser(true);
    try {
      await apiClient.delete(`/user/${deleteUserModal}`);
      toast.success('User deleted successfully!');
      setDeleteUserModal(null);
      await loadUsers(currentPage);
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeletingUser(false);
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg">
              <UsersIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Users</h1>
              <p className="text-gray-600">Manage system users</p>
            </div>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg"
          >
            <UserPlus className="w-5 h-5" />
            New User
          </button>
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {users.length} of {total} users
          </div>
          <input
            type="text"
            placeholder="🔍 Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
          />
        </div>

        {filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No users found</p>
          </div>
        ) : (
          <>
            <div className="grid gap-4">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg">
                      {user.email[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{user.email}</h3>
                      <p className="text-sm text-gray-500">ID: {user.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'SUPERADMIN' 
                        ? 'bg-purple-100 text-purple-700' 
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user.role}
                    </span>
                    {user.role !== 'SUPERADMIN' && (
                    <button
                      onClick={() => setDeleteUserModal(user.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
            </div>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={loadUsers}
            />
          </>
        )}
      </div>

      {deleteUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Delete User</h2>
              <button
                onClick={() => setDeleteUserModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteUserModal(null)}
                variant="secondary"
                className="flex-1"
                disabled={deletingUser}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteUser}
                variant="danger"
                loading={deletingUser}
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

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Create New User</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email Address"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="user@example.com"
                icon={Mail}
                error={errors.email}
                disabled={creating}
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                icon={Lock}
                error={errors.password}
                disabled={creating}
              />

              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FolderOpen className="w-4 h-4 text-purple-600" />
                  Assign to Project (Optional)
                </label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="🔍 Search projects..."
                    value={searchProject}
                    onChange={(e) => setSearchProject(e.target.value)}
                    className="block w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white shadow-sm"
                    disabled={creating}
                  />
                  {searchProject && (
                    <button
                      type="button"
                      onClick={() => setSearchProject('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {form.projectIds.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.projectIds.map((projectId) => {
                      const project = projects.find((p) => p.id.toString() === projectId);
                      return (
                        <div key={projectId} className="flex items-center gap-2 bg-white border-2 border-purple-300 rounded-lg px-3 py-2 shadow-sm">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <FolderOpen className="w-3 h-3 text-white" />
                          </div>
                          <span className="font-medium text-sm text-gray-800">{project?.title}</span>
                          <button
                            type="button"
                            onClick={() => setForm({ ...form, projectIds: form.projectIds.filter(id => id !== projectId) })}
                            className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                            disabled={creating}
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
                {searchProject && (
                  <select
                    value=""
                    onChange={(e) => {
                      if (e.target.value && !form.projectIds.includes(e.target.value)) {
                        setForm({ ...form, projectIds: [...form.projectIds, e.target.value] });
                        setSearchProject('');
                      }
                    }}
                    className="block w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 transition-all bg-white shadow-sm font-medium text-gray-700"
                    disabled={creating}
                    size={Math.min(projects.filter((p) => p.title.toLowerCase().includes(searchProject.toLowerCase())).length + 1, 5)}
                  >
                    <option value="" className="text-gray-500">✨ Select project to add</option>
                    {projects
                      .filter((p) => p.title.toLowerCase().includes(searchProject.toLowerCase()))
                      .filter((p) => !form.projectIds.includes(p.id.toString()))
                      .map((project) => (
                        <option key={project.id} value={project.id} className="py-2">
                          📁 {project.title}
                        </option>
                      ))}
                  </select>
                )}
                {searchProject && (
                  <div className="mt-2 flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg w-fit">
                    <span className="font-semibold">
                      {projects.filter((p) => p.title.toLowerCase().includes(searchProject.toLowerCase())).length}
                    </span>
                    <span>project(s) found</span>
                  </div>
                )}
              </div>

              <Button type="submit" loading={creating} loadingText="Creating..." icon={UserPlus}>
                Create User
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
