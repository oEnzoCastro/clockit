'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface UserType {
  id: string;
  name: string;
  email: string;
  institute_role: string;
  institute_id: string;
  area?: any;
}

interface AuthContextType {
  accessToken: string | null;
  user: UserType | null;
  isAuthReady: boolean;

  login: (token: string, user: UserType) => void;
  logout: () => Promise<void>;

  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;
  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // ------------------- REFRESH TOKEN -------------------
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      if (res.status === 401 || res.status === 403) {
        setAccessToken(null);
        return null;
      }

      if (!res.ok) throw new Error('Failed to refresh token');

      const data = await res.json();
      const newToken = data?.accessToken as string | undefined;

      if (!newToken) {
        setAccessToken(null);
        return null;
      }

      setAccessToken(newToken);
      return newToken;
    } catch {
      setAccessToken(null);
      return null;
    }
  };

  const fetchMe = async (token: string): Promise<UserType | null> => {
    try {
      const res = await fetch('http://localhost:5000/auth/me', {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
        credentials: 'include',
      });

      if (!res.ok) {
        setUser(null);
        return null;
      }

      const data = await res.json();
      const me = data?.data as UserType;

      setUser(me);
      return me;
    } catch (err) {
      console.error(err);
      setUser(null);
      return null;
    }
  };

  // ✅ bootstrap (AGORA vem depois das funções)
  useEffect(() => {
    const bootstrapAuth = async () => {
      const newToken = await refreshAccessToken();
      if (newToken) await fetchMe(newToken);

      // ✅ sempre marca como pronto, com ou sem login
      setIsAuthReady(true);
    };

    bootstrapAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------- LOGIN -------------------
  const login = (token: string, userData: UserType) => {
    setAccessToken(token);
    setUser(userData);
    setIsAuthReady(true);
  };

  // ------------------- LOGOUT -------------------
  const logout = async () => {
    setAccessToken(null);
    setUser(null);
    setIsAuthReady(true);

    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
        isAuthReady,
        login,
        logout,
        setAccessToken,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};