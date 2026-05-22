'use client';
import { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { login as loginAction, register as registerAction, logout as logoutAction, clearError, setUser } from './store/authSlice';
import { fetchFavorites } from './store/moviesSlice';
import { setToken, setCurrentUser } from './api-service';

interface AuthContextType {
  user: { id: string; email: string; username: string; avatar?: string } | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (email: string, username: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);
  const error = useAppSelector((state) => state.auth.error);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();
        if (data.user && data.token) {
          setToken(data.token);
          setCurrentUser(data.user);
          dispatch(setUser(data.user));
          dispatch(fetchFavorites());
        }
      } catch (err) {
        console.error('Session restore error:', err);
      } finally {
        setInitialLoading(false);
      }
    };
    restoreSession();
  }, [dispatch]);

  const login = async (email: string, password: string) => {
    try {
      const result = await dispatch(loginAction({ email, password })).unwrap();
      if (result) {
        return { success: true };
      }
      return { success: false, message: error || 'Login failed' };
    } catch (err: any) {
      return { success: false, message: err || 'Login failed' };
    }
  };

  const register = async (email: string, username: string, password: string) => {
    try {
      const result = await dispatch(registerAction({ email, username, password })).unwrap();
      if (result) {
        return { success: true };
      }
      return { success: false, message: error || 'Registration failed' };
    } catch (err: any) {
      return { success: false, message: err || 'Registration failed' };
    }
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <AuthContext.Provider value={{ user, loading: initialLoading || loading, error, login, register, logout, clearError: handleClearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
