'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJwtPayload } from '@/lib/jwt';

type JwtPayload = {
  institute_role?: string;
  userId?: string;
  id?: string;
};

export function useProtectedPage(allowedRoles?: string[]) {
  const router = useRouter();
  const { accessToken, refreshAccessToken } = useAuth();

  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;

    (async () => {
      // 1) Garantir token (tenta refresh se não tiver)
      let token = accessToken;

      if (!token) {
        token = await refreshAccessToken(); // <- retorna string | null
      }

      // 2) Se não conseguiu token, manda pro login
      if (!token) {
        router.replace('/login');
        return;
      }

      // 3) Se tiver roles permitidas, valida no payload
      if (allowedRoles && allowedRoles.length > 0) {
        const payload = decodeJwtPayload<JwtPayload>(token);
        const role = payload?.institute_role;

        if (!role || !allowedRoles.includes(role)) {
          router.replace('/403');
          return;
        }
      }

      // 4) Liberar render da página
      if (alive) setChecking(false);
    })();

    return () => {
      alive = false;
    };
  }, [accessToken, refreshAccessToken, router, allowedRoles]);

  return { checking };
}