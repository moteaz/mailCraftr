import React from 'react';
import { cn } from '@/lib/utils/cn';
import type { LucideIcon } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: LucideIcon;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon: Icon, error, className, id, name, ...props }, ref) => {
    const inputId = id ?? name;

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={inputId} className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
            {label}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute inset-y-0 left-0 pl-2.5 sm:pl-3 flex items-center pointer-events-none">
              <Icon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            name={name}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            className={cn(
              'block w-full px-3 py-2 sm:py-3 border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed text-sm sm:text-base',
              Icon && 'pl-9 sm:pl-10',
              error ? 'border-red-500' : 'border-gray-300',
              className
            )}
            {...props}
          />
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="mt-1.5 text-xs sm:text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
