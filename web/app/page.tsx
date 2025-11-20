'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { isTokenValid } from '../app/utils/auth';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');

    if (token && isTokenValid(token)) {
      router.push('/dashboard');  
    } else {
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  }, [router]);

  return <p>Loading...</p>;
}
