import type { LucideIcon } from 'lucide-react';

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  gradient: string;
}

export function StatCard({ icon: Icon, label, value, gradient }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-3 sm:p-6 border border-gray-200 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-center justify-between gap-2 sm:gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 mb-1 truncate">
            {label}
          </p>
          <p className="text-xl sm:text-3xl font-bold text-gray-900">
            {value}
          </p>
        </div>
        <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg flex-shrink-0`}>
          <Icon className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
        </div>
      </div>
    </div>
  );
}
