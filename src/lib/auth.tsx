import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE = '/api/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  company?: string;
  title?: string;
  phone?: string;
  department?: string;
  avatar_url?: string;
  is_master?: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  socialLogin: (provider: string, data: SocialData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  company?: string;
  title?: string;
  phone?: string;
}

export interface SocialData {
  providerId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('aigov_token'));
  const [isLoading, setIsLoading] = useState(true);

  const setAuth = useCallback((newToken: string, newUser: User) => {
    localStorage.setItem('aigov_token', newToken);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('aigov_token');
    setToken(null);
    setUser(null);
  }, []);

  // Check existing token on mount
  useEffect(() => {
    const checkAuth = async () => {
      const saved = localStorage.getItem('aigov_token');
      if (!saved) { setIsLoading(false); return; }
      try {
        const res = await fetch(`${API_BASE}/me`, {
          headers: { Authorization: `Bearer ${saved}` }
        });
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          setToken(saved);
        } else {
          localStorage.removeItem('aigov_token');
        }
      } catch {
        // Server may be down, keep token for retry
      }
      setIsLoading(false);
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setAuth(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: '서버에 연결할 수 없습니다' };
    }
  };

  const register = async (regData: RegisterData) => {
    try {
      const res = await fetch(`${API_BASE}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(regData),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setAuth(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: '서버에 연결할 수 없습니다' };
    }
  };

  const socialLogin = async (provider: string, socialData: SocialData) => {
    try {
      const res = await fetch(`${API_BASE}/social`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, ...socialData }),
      });
      const data = await res.json();
      if (!res.ok) return { success: false, error: data.error };
      setAuth(data.token, data.user);
      return { success: true };
    } catch {
      return { success: false, error: '서버에 연결할 수 없습니다' };
    }
  };

  return (
    <AuthContext.Provider value={{
      user, token, isLoading,
      isAuthenticated: !!user && !!token,
      login, register, socialLogin, logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
