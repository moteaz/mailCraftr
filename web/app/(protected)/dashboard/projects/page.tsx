"use client";

import { useEffect, useState } from "react";
import {
  FolderOpen,
  Calendar,
  User,
  Users,
  Plus,
  X,
  Trash2,
  UserPlus,
} from 'lucide-react';
import { apiClient } from "@/lib/api/client";
import { API_ENDPOINTS } from "@/lib/api/endpoints";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useAuth } from "@/hooks/use-auth";
import type { Project, ApiError } from "@/lib/api/types";

export default function ProjectsListPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedProject, setExpandedProject] = useState<number | null>(null);
  const [total, setTotal] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    userEmails: [] as string[],
  });
  const [creating, setCreating] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [searchUser, setSearchUser] = useState("");
  const [addUserModal, setAddUserModal] = useState<number | null>(null);
  const [userEmail, setUserEmail] = useState("");
  const [addingUser, setAddingUser] = useState(false);
  const [deleteUserModal, setDeleteUserModal] = useState<{
    projectId: number;
    email: string;
  } | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  const [deleteProjectModal, setDeleteProjectModal] = useState<number | null>(
    null
  );
  const [deletingProject, setDeletingProject] = useState(false);

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const loadProjects = async () => {
    try {
      if (user?.role === "SUPERADMIN") {
        const response = await apiClient.get<any>(
          API_ENDPOINTS.PROJECT.PAGINATED(1, 100)
        );
        setProjects(response.data);
        setTotal(response.meta.total);
      } else {
        const projectsRes = await apiClient.get<Project[]>(
          API_ENDPOINTS.PROJECT.MY_PROJECTS
        );
        setProjects(projectsRes);
        setTotal(projectsRes.length);
      }
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to load projects");
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        await loadProjects();
        if (user?.role === "SUPERADMIN") {
          const usersRes = await apiClient.get<any>(API_ENDPOINTS.USER.LIST);
          setUsers(Array.isArray(usersRes) ? usersRes : usersRes.data || []);
        }
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      loadData();
    }
  }, [user]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Title is required");
      return;
    }

    setCreating(true);
    try {
      const response: any = await apiClient.post(API_ENDPOINTS.PROJECT.CREATE, {
        title: form.title,
        description: form.description,
      });
      const projectId = response.project.id;

      for (const email of form.userEmails) {
        await apiClient.post(`/project/${projectId}/add-user`, { email });
      }

      toast.success("Project created successfully!");
      setForm({ title: "", description: "", userEmails: [] });
      setSearchUser("");
      setIsModalOpen(false);
      await loadProjects();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userEmail.trim() || !addUserModal) return;

    setAddingUser(true);
    try {
      await apiClient.post(`/project/${addUserModal}/add-user`, {
        email: userEmail,
      });
      toast.success("User added successfully!");
      setUserEmail("");
      setAddUserModal(null);
      await loadProjects();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to add user");
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteUserModal) return;

    setDeletingUser(true);
    try {
      await apiClient.delete(
        `/project/${deleteUserModal.projectId}/delete-user`,
        { email: deleteUserModal.email }
      );
      toast.success("User removed successfully!");
      setDeleteUserModal(null);
      await loadProjects();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to remove user");
    } finally {
      setDeletingUser(false);
    }
  };

  const handleDeleteProject = async () => {
    if (!deleteProjectModal) return;

    setDeletingProject(true);
    try {
      await apiClient.delete(`/project/${deleteProjectModal}`);
      toast.success("Project deleted successfully!");
      setDeleteProjectModal(null);
      await loadProjects();
    } catch (err) {
      const error = err as ApiError;
      toast.error(error.message || "Failed to delete project");
    } finally {
      setDeletingProject(false);
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-lg">
              <FolderOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
              <p className="text-gray-600">Manage your projects</p>
            </div>
          </div>

          {user?.role === "SUPERADMIN" && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
            >
              <Plus className="w-5 h-5" />
              New Project
            </button>
          )}
        </div>

        <div className="mb-4 flex items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing {filteredProjects.length} of {total} projects
          </div>
          <input
            type="text"
            placeholder="🔍 Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
          />
        </div>

        {filteredProjects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.title}
                  </h3>
                  {user?.role === "SUPERADMIN" && (
                    <button
                      onClick={() => setDeleteProjectModal(project.id)}
                      className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
                <p className="text-gray-600 mb-4">{project.description}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(project.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  {user?.role === "SUPERADMIN" && (
                    <button
                      onClick={() =>
                        setExpandedProject(
                          expandedProject === project.id ? null : project.id
                        )
                      }
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                    >
                      <Users className="w-4 h-4" />
                      {project.users?.length || 0} Users
                    </button>
                  )}
                </div>
                {expandedProject === project.id && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm font-semibold text-gray-900">
                        Project Users:
                      </h4>
                      {user?.role === "SUPERADMIN" && (
                        <button
                          onClick={() => setAddUserModal(project.id)}
                          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                        >
                          <UserPlus className="w-3 h-3" />
                          Add User
                        </button>
                      )}
                    </div>
                    {!project.users || project.users.length === 0 ? (
                      <p className="text-sm text-gray-500">No users assigned</p>
                    ) : (
                      <ul className="space-y-1">
                        {project.users.map((user: any, idx: number) => (
                          <li
                            key={idx}
                            className="text-sm text-gray-600 flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3" />
                              {user.email || user}
                            </div>
                            {user?.role === "SUPERADMIN" && (
                              <button
                                onClick={() =>
                                  setDeleteUserModal({
                                    projectId: project.id,
                                    email: user.email || user,
                                  })
                                }
                                className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Create New Project
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Title"
                name="title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Project title"
                disabled={creating}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  placeholder="Project description"
                  disabled={creating}
                  rows={4}
                  className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-100">
                <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  Assign Users (Optional)
                </label>
                <div className="relative mb-3">
                  <input
                    type="text"
                    placeholder="🔍 Search users..."
                    value={searchUser}
                    onChange={(e) => setSearchUser(e.target.value)}
                    className="block w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white shadow-sm"
                    disabled={creating}
                  />
                  {searchUser && (
                    <button
                      type="button"
                      onClick={() => setSearchUser("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
                {form.userEmails.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {form.userEmails.map((email) => (
                      <div
                        key={email}
                        className="flex items-center gap-2 bg-white border-2 border-purple-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                          <User className="w-3 h-3 text-white" />
                        </div>
                        <span className="font-medium text-sm text-gray-800">
                          {email}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setForm({
                              ...form,
                              userEmails: form.userEmails.filter(
                                (e) => e !== email
                              ),
                            })
                          }
                          className="p-1 hover:bg-red-50 text-red-600 rounded transition-colors"
                          disabled={creating}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                {searchUser && (
                  <>
                    <select
                      value=""
                      onChange={(e) => {
                        if (
                          e.target.value &&
                          !form.userEmails.includes(e.target.value)
                        ) {
                          setForm({
                            ...form,
                            userEmails: [...form.userEmails, e.target.value],
                          });
                          setSearchUser("");
                        }
                      }}
                      className="block w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 transition-all bg-white shadow-sm font-medium text-gray-700"
                      disabled={creating}
                      size={Math.min(
                        users.filter((u) =>
                          u.email
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                        ).length + 1,
                        5
                      )}
                    >
                      <option value="" className="text-gray-500">
                        ✨ Select user to add
                      </option>
                      {users
                        .filter((u) =>
                          u.email
                            .toLowerCase()
                            .includes(searchUser.toLowerCase())
                        )
                        .filter((u) => !form.userEmails.includes(u.email))
                        .map((user) => (
                          <option
                            key={user.id}
                            value={user.email}
                            className="py-2"
                          >
                            👤 {user.email}
                          </option>
                        ))}
                    </select>
                    <div className="mt-2 flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg w-fit">
                      <span className="font-semibold">
                        {
                          users.filter((u) =>
                            u.email
                              .toLowerCase()
                              .includes(searchUser.toLowerCase())
                          ).length
                        }
                      </span>
                      <span>user(s) found</span>
                    </div>
                  </>
                )}
              </div>
              <Button
                type="submit"
                loading={creating}
                loadingText="Creating..."
                icon={Plus}
              >
                Create Project
              </Button>
            </form>
          </div>
        </div>
      )}

      {addUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Add User to Project
              </h2>
              <button
                onClick={() => {
                  setAddUserModal(null);
                  setUserEmail("");
                }}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser} className="space-y-4">
              <Input
                label="User Email"
                name="email"
                type="email"
                value={userEmail}
                onChange={(e) => setUserEmail(e.target.value)}
                placeholder="user@example.com"
                disabled={addingUser}
              />
              <Button
                type="submit"
                loading={addingUser}
                loadingText="Adding..."
                icon={UserPlus}
              >
                Add User
              </Button>
            </form>
          </div>
        </div>
      )}

      {deleteUserModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Remove User</h2>
              <button
                onClick={() => setDeleteUserModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to remove{" "}
              <strong>{deleteUserModal.email}</strong> from this project?
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
                loadingText="Removing..."
                icon={Trash2}
                className="flex-1"
              >
                Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteProjectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Delete Project
              </h2>
              <button
                onClick={() => setDeleteProjectModal(null)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this project? This action cannot
              be undone.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setDeleteProjectModal(null)}
                variant="secondary"
                className="flex-1"
                disabled={deletingProject}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteProject}
                variant="danger"
                loading={deletingProject}
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
