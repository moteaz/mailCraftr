'use client';

import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

interface NavbarProps {
  onMobileMenuToggle: (open: boolean) => void;
  isMobileMenuOpen: boolean;
}

export function Navbar({ onMobileMenuToggle, isMobileMenuOpen }: NavbarProps) {
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 h-14 sm:h-16 bg-white border-b border-gray-200 z-50 backdrop-blur-sm bg-white/90">
      <div className="flex items-center justify-between h-full px-2 sm:px-4 lg:px-6">
        <div className="flex items-center gap-1.5 sm:gap-4 min-w-0 flex-1">
          <button
            onClick={() => onMobileMenuToggle(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
          </button>

          <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs sm:text-sm">M</span>
            </div>
            <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
              MailCraftr
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="hidden md:block text-right max-w-[200px]">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.email}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-lg text-xs sm:text-base flex-shrink-0">
            {user?.email?.[0].toUpperCase()}
          </div>
        </div>
      </div>
    </nav>
  );
}
