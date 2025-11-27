import { Plus, Edit2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import type { Project } from '@/lib/api/types';

interface CategoryFormProps {
  form: { name: string; description: string; projectId: string };
  projects: Project[];
  loading: boolean;
  isEdit?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: string, value: string) => void;
}

export function CategoryForm({ form, projects, loading, isEdit, onSubmit, onChange }: CategoryFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        value={form.name}
        onChange={(e) => onChange('name', e.target.value)}
        placeholder="Category name"
        disabled={loading}
      />

      <Textarea
        label="Description"
        name="description"
        value={form.description}
        onChange={(e) => onChange('description', e.target.value)}
        placeholder="Category description"
        disabled={loading}
        rows={3}
      />

      {!isEdit && (
        <Select
          label="Project"
          value={form.projectId}
          onChange={(e) => onChange('projectId', e.target.value)}
          options={[
            { value: '', label: 'Select a project' },
            ...projects.map((p) => ({ value: p.id.toString(), label: p.title })),
          ]}
          disabled={loading}
        />
      )}

      <Button
        type="submit"
        loading={loading}
        loadingText={isEdit ? 'Updating...' : 'Creating...'}
        icon={isEdit ? Edit2 : Plus}
      >
        {isEdit ? 'Update Category' : 'Create Category'}
      </Button>
    </form>
  );
}
