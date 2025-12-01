import { Trash2 } from 'lucide-react';
import type { User } from '@/types';

interface UserCardProps {
  user: User;
  onDelete?: () => void;
}

export function UserCard({ user, onDelete }: UserCardProps) {
  return (
    <div className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-blue-200 transition-all bg-white">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg flex-shrink-0">
            {user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
              {user.email}
            </h3>
            <p className="text-sm text-gray-500">User ID: {user.id}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap ${
            user.role === 'SUPERADMIN' 
              ? 'bg-purple-100 text-purple-700 border border-purple-200' 
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {user.role}
          </span>
          {user.role !== 'SUPERADMIN' && onDelete && (
            <button
              onClick={onDelete}
              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete user"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
