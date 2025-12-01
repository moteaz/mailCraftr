import { useState } from 'react';
import { X, Plus, Users, User } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import type { User as UserType } from '@/types';

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  onCreate: (data: { title: string; description: string; email: string[] }) => Promise<void>;
}

export function CreateProjectModal({ isOpen, onClose, users, onCreate }: CreateProjectModalProps) {
  const [form, setForm] = useState({ title: '', description: '', email: [] as string[] });
  const [creating, setCreating] = useState(false);
  const [searchUser, setSearchUser] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    setCreating(true);
    try {
      await onCreate(form);
      setForm({ title: '', description: '', email: [] });
      setSearchUser('');
      onClose();
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Title"
            name="title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Project title"
            disabled={creating}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
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
                  onClick={() => setSearchUser('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-1 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            {form.email.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {form.email.map((email) => (
                  <div key={email} className="flex items-center gap-2 bg-white border-2 border-purple-300 rounded-lg px-3 py-2 shadow-sm hover:shadow-md transition-shadow">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <User className="w-3 h-3 text-white" />
                    </div>
                    <span className="font-medium text-sm text-gray-800">{email}</span>
                    <button
                      type="button"
                      onClick={() => setForm({ ...form, email: form.email.filter((e) => e !== email) })}
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
                    if (e.target.value && !form.email.includes(e.target.value)) {
                      setForm({ ...form, email: [...form.email, e.target.value] });
                      setSearchUser('');
                    }
                  }}
                  className="block w-full px-4 py-2.5 border-2 border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 transition-all bg-white shadow-sm font-medium text-gray-700"
                  disabled={creating}
                  size={Math.min(users.filter((u) => u.email.toLowerCase().includes(searchUser.toLowerCase())).length + 1, 5)}
                >
                  <option value="" className="text-gray-500">✨ Select user to add</option>
                  {users
                    .filter((u) => u.email.toLowerCase().includes(searchUser.toLowerCase()))
                    .filter((u) => !form.email.includes(u.email))
                    .map((user) => (
                      <option key={user.id} value={user.email} className="py-2">
                        👤 {user.email}
                      </option>
                    ))}
                </select>
                <div className="mt-2 flex items-center gap-2 text-xs text-purple-700 bg-purple-100 px-3 py-1.5 rounded-lg w-fit">
                  <span className="font-semibold">
                    {users.filter((u) => u.email.toLowerCase().includes(searchUser.toLowerCase())).length}
                  </span>
                  <span>user(s) found</span>
                </div>
              </>
            )}
          </div>
          <Button type="submit" loading={creating} loadingText="Creating..." icon={Plus}>
            Create Project
          </Button>
        </form>
      </div>
    </div>
  );
}
