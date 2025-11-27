import type { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  iconGradient?: string;
}

import type { LucideIcon } from 'lucide-react';

export function PageHeader({ 
  icon: Icon, 
  title, 
  description, 
  action,
  iconGradient = 'from-blue-600 to-indigo-600'
}: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${iconGradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm sm:text-base text-gray-600">{description}</p>
        </div>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}
