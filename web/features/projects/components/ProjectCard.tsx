import { FolderOpen, Calendar, Users, Trash2, UserPlus } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { Project } from '@/types';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete?: () => void;
  onAddUser?: () => void;
  onRemoveUser?: (email: string) => void;
  isSuperAdmin: boolean;
}

export function ProjectCard({
  project,
  isExpanded,
  onToggleExpand,
  onDelete,
  onAddUser,
  onRemoveUser,
  isSuperAdmin,
}: ProjectCardProps) {
  return (
    <div className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-purple-200 transition-all bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 text-purple-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600 transition-colors truncate">
                {project.title}
              </h3>
              {project.description && (
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">{project.description}</p>
              )}
            </div>
          </div>
        </div>
        {isSuperAdmin && onDelete && (
          <button
            onClick={onDelete}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
            title="Delete project"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        )}
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(project.createdAt)}</span>
        </div>
        {isSuperAdmin && (
          <button
            onClick={onToggleExpand}
            className="flex items-center gap-2 text-sm bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg hover:bg-purple-100 transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>{project.users?.length || 0} user{project.users?.length !== 1 ? 's' : ''}</span>
          </button>
        )}
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 bg-gray-50 -mx-4 sm:-mx-6 px-4 sm:px-6 py-4 rounded-b-xl">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-purple-600" />
              Project Users
            </h4>
            {isSuperAdmin && onAddUser && (
              <button
                onClick={onAddUser}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors shadow-sm"
              >
                <UserPlus className="w-3.5 h-3.5" />
                Add User
              </button>
            )}
          </div>
          {!project.users || project.users.length === 0 ? (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">No users assigned to this project</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {project.users.map((user: any, idx: number) => (
                <li
                  key={idx}
                  className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-xs font-semibold">
                      {(user.email || user)[0].toUpperCase()}
                    </div>
                    <span className="text-sm text-gray-700 font-medium">{user.email || user}</span>
                  </div>
                  {isSuperAdmin && onRemoveUser && (
                    <button
                      onClick={() => onRemoveUser(user.email || user)}
                      className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Remove user"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
