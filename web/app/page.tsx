'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { session } from '@/lib/auth/session';
import { ROUTES } from '@/constants';
import { Spinner } from '@/components/ui/spinner';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const isAuth = session.isAuthenticated();
    router.replace(isAuth ? ROUTES.DASHBOARD : ROUTES.LOGIN);
  }, [router]);

  return <Spinner />;
}
