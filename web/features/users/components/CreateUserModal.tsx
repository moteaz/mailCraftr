import { useState } from 'react';
import { X, UserPlus, FolderOpen } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { validators, validationMessages } from '@/lib/utils/validators';
import type { Project } from '@/types';

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  onCreate: (data: { email: string; password: string; projectIds: string[] }) => Promise<void>;
}

export function CreateUserModal({ isOpen, onClose, projects, onCreate }: CreateUserModalProps) {
  const [form, setForm] = useState({ email: '', password: '', projectIds: [] as string[] });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [creating, setCreating] = useState(false);
  const [searchProject, setSearchProject] = useState('');

  if (!isOpen) return null;

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
      await onCreate(form);
      setForm({ email: '', password: '', projectIds: [] });
      setSearchProject('');
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6 my-4 max-h-[calc(100vh-2rem)]">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 pr-2">Create New User</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 overflow-y-auto max-h-[calc(100vh-12rem)]">
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => {
              setForm({ ...form, email: e.target.value });
              if (errors.email) setErrors({ ...errors, email: undefined });
            }}
            placeholder="user@example.com"
            error={errors.email}
            disabled={creating}
          />

          <Input
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => {
              setForm({ ...form, password: e.target.value });
              if (errors.password) setErrors({ ...errors, password: undefined });
            }}
            placeholder="••••••••"
            error={errors.password}
            disabled={creating}
          />

          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-3 sm:p-4 rounded-xl border border-purple-100 max-h-[40vh] overflow-y-auto">
            <label className="block text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center gap-2">
              <FolderOpen className="w-4 h-4 text-purple-600" />
              Assign to Project (Optional)
            </label>
            <div className="relative mb-2 sm:mb-3">
              <input
                type="text"
                placeholder=" Search projects..."
                value={searchProject}
                onChange={(e) => setSearchProject(e.target.value)}
                className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-white shadow-sm text-sm"
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
              <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2 sm:mb-3">
                {form.projectIds.map((projectId) => {
                  const project = projects.find((p) => p.id.toString() === projectId);
                  return (
                    <div key={projectId} className="flex items-center gap-1.5 sm:gap-2 bg-white border-2 border-purple-300 rounded-lg px-2 sm:px-3 py-1.5 sm:py-2 shadow-sm">
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <FolderOpen className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" />
                      </div>
                      <span className="font-medium text-xs sm:text-sm text-gray-800 truncate max-w-[120px] sm:max-w-none">{project?.title}</span>
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
                className="block w-full px-3 sm:px-4 py-2 sm:py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 transition-all bg-white shadow-sm font-medium text-gray-700 text-sm"
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
  );
}
