import { FileText, Trash2 } from 'lucide-react';
import type { Template } from '@/types';

interface TemplateCardProps {
  template: Template;
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
}

export function TemplateCard({ template, onEdit, onDelete }: TemplateCardProps) {
  return (
    <div
      className="group border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-lg hover:border-orange-200 transition-all cursor-pointer bg-white"
      onClick={() => onEdit(template)}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center flex-shrink-0">
              <FileText className="w-5 h-5 text-orange-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors truncate">
                {template.name}
              </h3>
              {template.description && (
                <p className="text-gray-600 text-sm mt-0.5 line-clamp-1">{template.description}</p>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(template.id);
          }}
          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex-shrink-0"
          title="Delete template"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-gray-100">
        {template.categorie?.name && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
            <span className="font-medium">📂</span>
            <span>{template.categorie.name}</span>
          </div>
        )}
        {Array.isArray(template.placeholders) && template.placeholders.length > 0 && (
          <div className="flex items-center gap-2 text-sm bg-orange-50 text-orange-700 px-3 py-1.5 rounded-lg">
            <span className="font-medium">{template.placeholders.length}</span>
            <span>placeholder{template.placeholders.length !== 1 ? 's' : ''}</span>
          </div>
        )}
        <div className="ml-auto text-xs text-gray-400 group-hover:text-orange-600 transition-colors">
          Click to edit →
        </div>
      </div>
    </div>
  );
}
