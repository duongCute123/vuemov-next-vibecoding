'use client';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';
const TOKEN_KEY = 'nhungmov_token';
const USER_KEY = 'nhungmov_user';

export interface LoginResult {
  success: boolean;
  message?: string;
}

export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const response = await fetch(`${BACKEND_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(error.message || 'Request failed');
  }
  
  return response.json();
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const data = await fetchApi<{ success: boolean; token?: string; user?: User; message?: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      return { success: true };
    }
    return { success: false, message: data.message || 'Login failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

export async function register(email: string, username: string, password: string): Promise<LoginResult> {
  try {
    const data = await fetchApi<{ success: boolean; token?: string; user?: User; message?: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    
    if (data.success && data.token) {
      setToken(data.token);
      if (data.user) {
        localStorage.setItem(USER_KEY, JSON.stringify(data.user));
      }
      return { success: true };
    }
    return { success: false, message: data.message || 'Registration failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

export function logout(): void {
  removeToken();
  localStorage.removeItem(USER_KEY);
}

export function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
}

export function removeToken(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem(USER_KEY);
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

export async function getFavorites(): Promise<string[]> {
  try {
    const data = await fetchApi<{ success: boolean; favorites: string[] }>('/api/user/favorites');
    return data.favorites || [];
  } catch {
    return [];
  }
}

export async function addFavorite(slug: string): Promise<void> {
  await fetchApi('/api/user/favorites', {
    method: 'POST',
    body: JSON.stringify({ slug }),
  });
}

export async function removeFavorite(slug: string): Promise<void> {
  await fetchApi(`/api/user/favorites/${slug}`, {
    method: 'DELETE',
  });
}

export async function checkFavorite(slug: string): Promise<boolean> {
  try {
    const data = await fetchApi<{ success: boolean; isFavorite: boolean }>(`/api/user/favorites/${slug}`);
    return data.isFavorite || false;
  } catch {
    return false;
  }
}

export async function getHistory(): Promise<Array<{ slug: string; watchedAt: string }>> {
  try {
    const data = await fetchApi<{ success: boolean; history: Array<{ slug: string; watchedAt: string }> }>('/api/user/history');
    return data.history || [];
  } catch {
    return [];
  }
}

export async function addHistory(slug: string): Promise<void> {
  await fetchApi('/api/user/history', {
    method: 'POST',
    body: JSON.stringify({ slug }),
  });
}

export async function removeHistory(slug: string): Promise<void> {
  await fetchApi(`/api/user/history/${slug}`, {
    method: 'DELETE',
  });
}

export async function clearHistory(): Promise<void> {
  await fetchApi('/api/user/history', {
    method: 'DELETE',
  });
}

export async function getComments(slug: string): Promise<Array<{
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}>> {
  try {
    const data = await fetchApi<{ success: boolean; comments: Array<{
      id: string;
      userId: string;
      username: string;
      content: string;
      rating: number;
      createdAt: string;
    }> }>(`/api/comments/${slug}`);
    return data.comments || [];
  } catch {
    return [];
  }
}

export async function addComment(slug: string, content: string, rating: number = 0): Promise<{
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
} | null> {
  try {
    const data = await fetchApi<{ success: boolean; comment: {
      id: string;
      userId: string;
      username: string;
      content: string;
      rating: number;
      createdAt: string;
    } }>(`/api/comments/${slug}`, {
      method: 'POST',
      body: JSON.stringify({ content, rating }),
    });
    return data.comment || null;
  } catch {
    return null;
  }
}

export async function deleteComment(commentId: string, slug: string): Promise<void> {
  await fetchApi(`/api/comments/${slug}/${commentId}`, {
    method: 'DELETE',
  });
}