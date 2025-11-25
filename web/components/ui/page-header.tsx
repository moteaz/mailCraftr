import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  gradient?: 'blue' | 'purple' | 'green' | 'orange';
}

export function PageHeader({ icon: Icon, title, description, action, gradient = 'blue' }: PageHeaderProps) {
  const gradients = {
    blue: 'from-blue-600 to-indigo-600',
    purple: 'from-purple-600 to-pink-600',
    green: 'from-green-600 to-teal-600',
    orange: 'from-orange-600 to-red-600',
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className={cn('w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-lg flex-shrink-0', gradients[gradient])}>
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 truncate">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600 truncate">{description}</p>
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
