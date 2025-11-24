import { Trash2 } from 'lucide-react';
import { memo } from 'react';
import type { User } from '@/lib/api/types';

interface UserCardProps {
  user: User;
  onDelete?: () => void;
}

export const UserCard = memo(function UserCard({ user, onDelete }: UserCardProps) {
  const canDelete = user.role !== 'SUPERADMIN' && onDelete;

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200 bg-gradient-to-br from-white to-gray-50">
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
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'SUPERADMIN'
                ? 'bg-purple-100 text-purple-700'
                : 'bg-blue-100 text-blue-700'
            }`}
          >
            {user.role}
          </span>
          {canDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              aria-label={`Delete ${user.email}`}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});
