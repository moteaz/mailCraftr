'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/navbar';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { session } from '@/lib/auth/session';
import { ROUTES } from '@/lib/constants';
import { Spinner } from '@/components/ui/spinner';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { initialize, isAuthenticated } = useAuthStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initialize();
    
    if (!session.isAuthenticated()) {
      router.replace(ROUTES.LOGIN);
      return;
    }
    
    setIsLoading(false);
  }, [initialize, router]);

  if (isLoading || !isAuthenticated) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar 
        onMobileMenuToggle={setIsMobileMenuOpen} 
        isMobileMenuOpen={isMobileMenuOpen} 
      />
      <Sidebar 
        isMobileMenuOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      <main className="pt-14 sm:pt-16 lg:pl-64 transition-all duration-300 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
