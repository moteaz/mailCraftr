// Design System Constants
export const DESIGN_SYSTEM = {
  // Spacing scale (Tailwind-based)
  spacing: {
    xs: 'gap-2',
    sm: 'gap-3',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  },
  
  // Container widths
  container: {
    sm: 'max-w-2xl',
    md: 'max-w-4xl',
    lg: 'max-w-6xl',
    xl: 'max-w-7xl',
  },
  
  // Border radius
  radius: {
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
  },
  
  // Shadows
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  },
  
  // Typography
  text: {
    xs: 'text-xs',
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
  },
  
  // Gradients
  gradient: {
    blue: 'bg-gradient-to-r from-blue-600 to-indigo-600',
    purple: 'bg-gradient-to-r from-purple-600 to-pink-600',
    green: 'bg-gradient-to-r from-green-600 to-teal-600',
    orange: 'bg-gradient-to-r from-orange-600 to-red-600',
  },
} as const;
