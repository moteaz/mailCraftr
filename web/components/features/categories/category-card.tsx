import { Calendar, FolderOpen, Edit2, Trash2 } from 'lucide-react';
import { formatDate } from '@/lib/utils/format';
import type { Category } from '@/types';

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
  onDelete: (id: number) => void;
}

export function CategoryCard({ category, onEdit, onDelete }: CategoryCardProps) {
  return (
    <div className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-green-200 transition-all bg-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center flex-shrink-0">
              <FolderOpen className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600 transition-colors truncate">{category.name}</h3>
              {category.description && (
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">{category.description}</p>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit category"
          >
            <Edit2 className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete category"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
          <span className="font-medium">📁</span>
          <span>{category.project?.title || 'Unknown'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span>{formatDate(category.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
