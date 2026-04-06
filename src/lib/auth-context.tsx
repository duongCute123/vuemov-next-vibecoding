'use client';
import { createContext, useContext, ReactNode } from 'react';
import { useAppSelector, useAppDispatch } from './store/hooks';
import { login as loginAction, register as registerAction, logout as logoutAction, clearError } from './store/authSlice';

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

  const login = async (email: string, password: string) => {
    const result = await dispatch(loginAction({ email, password })).unwrap();
    if (result) {
      return { success: true };
    }
    return { success: false, message: error || 'Login failed' };
  };

  const register = async (email: string, username: string, password: string) => {
    const result = await dispatch(registerAction({ email, username, password })).unwrap();
    if (result) {
      return { success: true };
    }
    return { success: false, message: error || 'Registration failed' };
  };

  const logout = () => {
    dispatch(logoutAction());
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, clearError: handleClearError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}