import { FileText } from 'lucide-react';

interface EmptyStateProps {
  message: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export function EmptyState({ message, icon: Icon = FileText }: EmptyStateProps) {
  return (
    <div className="text-center py-16">
      <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
        <Icon className="w-10 h-10 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Nothing here yet</h3>
      <p className="text-gray-500">{message}</p>
    </div>
  );
}
