'use client';

import { useRouter, usePathname } from 'next/navigation';
import { UserPlus, LogOut, LayoutDashboard, FolderOpen,FileText  } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ROUTES } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  isMobileMenuOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isMobileMenuOpen, onClose }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navigate = (path: string) => {
    router.push(path);
    onClose();
  };

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: ROUTES.DASHBOARD },
    ...(user?.role === 'SUPERADMIN' ? [{ icon: UserPlus, label: 'Users Management', path: ROUTES.USERS_CREATE }] : []),
    { icon: FolderOpen, label: 'Projects', path: ROUTES.PROJECTS_LIST },
    { icon: FileText, label: 'Categories', path: ROUTES.CATEGORIES_LIST },
  ];

  return (
    <>
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed top-16 bottom-0 w-64 bg-white border-r border-gray-200 z-40 transition-transform duration-300',
          'lg:translate-x-0',
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <nav className="p-4 space-y-2 h-full flex flex-col">
          <div className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200',
                    isActive
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
                      : 'text-gray-700 hover:bg-gray-100'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </nav>
      </aside>
    </>
  );
}
