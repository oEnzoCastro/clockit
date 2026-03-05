'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

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

  login: (token: string, user: UserType) => void;
  logout: () => Promise<void>;

  setAccessToken: React.Dispatch<React.SetStateAction<string | null>>;

  refreshAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<UserType | null>(null);

  // ------------------- LOGIN -------------------
  const login = (token: string, userData: UserType) => {
    setAccessToken(token);
    setUser(userData);
  };

  // ------------------- LOGOUT -------------------
  const logout = async () => {
    // limpa estado local
    setAccessToken(null);
    setUser(null);

    // tenta limpar cookie no backend (se não tiver cookie, ok)
    try {
      await fetch('http://localhost:5000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  // ------------------- REFRESH TOKEN -------------------
  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const res = await fetch('http://localhost:5000/auth/refresh', {
        method: 'POST',
        credentials: 'include',
      });

      // sem refresh token / inválido => deslogado
      if (res.status === 401 || res.status === 403) {
        setAccessToken(null);
        return null;
      }

      if (!res.ok) {
        throw new Error('Failed to refresh token');
      }

      const data = await res.json();

      const newToken = data?.accessToken as string | undefined;
      if (!newToken) {
        setAccessToken(null);
        return null;
      }

      setAccessToken(newToken);
      return newToken;
    } catch (err) {
      // não chama logout aqui pra não ficar batendo /logout
      setAccessToken(null);
      return null;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        user,
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

// ------------------- HOOK -------------------
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};