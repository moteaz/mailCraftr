import { Calendar, User, Users, Trash2, UserPlus } from 'lucide-react';
import { memo } from 'react';
import type { Project } from '@/lib/api/types';

interface ProjectCardProps {
  project: Project;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onDelete: () => void;
  onAddUser: () => void;
  onRemoveUser: (email: string) => void;
}

export const ProjectCard = memo(function ProjectCard({
  project,
  isExpanded,
  onToggleExpand,
  onDelete,
  onAddUser,
  onRemoveUser,
}: ProjectCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
        <button
          onClick={onDelete}
          className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
          aria-label={`Delete ${project.title}`}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {project.description && (
        <p className="text-gray-600 mb-4">{project.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>Owner ID: {project.ownerId}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{new Date(project.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        <button
          onClick={onToggleExpand}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          aria-expanded={isExpanded}
        >
          <Users className="w-4 h-4" />
          {project.users.length} Users
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-semibold text-gray-900">Project Users:</h4>
            <button
              onClick={onAddUser}
              className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            >
              <UserPlus className="w-3 h-3" />
              Add User
            </button>
          </div>

          {project.users.length === 0 ? (
            <p className="text-sm text-gray-500">No users assigned</p>
          ) : (
            <ul className="space-y-1">
              {project.users.map((user: any) => (
                <li key={user.id} className="text-sm text-gray-600 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User className="w-3 h-3" />
                    <span>{user.email}</span>
                  </div>
                  <button
                    onClick={() => onRemoveUser(user.email)}
                    className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                    aria-label={`Remove ${user.email}`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
});
