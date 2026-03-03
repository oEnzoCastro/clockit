'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export function useGuestOnlyPage(redirectTo = '/dashboard') {
  const router = useRouter();
  const { accessToken, refreshAccessToken } = useAuth();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 1) se já tem token, redireciona e para
      if (accessToken) {
        router.replace(redirectTo);
        return;
      }

      // 2) tenta refresh. Se funcionar, redireciona. Se falhar, fica no login.
      try {
        await refreshAccessToken();
        router.replace(redirectTo);
        return;
      } catch {
        if (alive) setChecking(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [accessToken, refreshAccessToken, router, redirectTo]);

  return { checking };
}