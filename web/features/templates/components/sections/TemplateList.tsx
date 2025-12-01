import type { Template } from '@/types';
import { TemplateCard } from '../ui/TemplateCard';
import { EmptyState } from '../ui/EmptyState';

interface TemplateListProps {
  templates: Template[];
  onEdit: (template: Template) => void;
  onDelete: (id: number) => void;
  onCreateClick: () => void;
}

export function TemplateList({ templates, onEdit, onDelete, onCreateClick }: TemplateListProps) {
  if (templates.length === 0) {
    return <EmptyState onCreateClick={onCreateClick} />;
  }

  return (
    <div className="grid gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
