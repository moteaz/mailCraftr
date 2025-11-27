import { Calendar, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { Category } from '@/lib/api/types';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-3 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2 gap-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{category.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            aria-label="Edit category"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete category"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6 text-xs sm:text-sm text-gray-500 mt-4">
        <div className="flex items-center gap-2">
          <FolderOpen className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{category.project?.title || 'Unknown Project'}</span>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 flex-shrink-0" />
          <span>{formatDate(category.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
