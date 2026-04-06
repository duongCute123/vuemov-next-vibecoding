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
  const url = `${BACKEND_URL}${endpoint}`;
  console.log('fetchApi called:', { url, method: options.method, token: token ? 'yes' : 'no' });
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
  
  console.log('fetchApi response status:', response.status);
  
  const text = await response.text();
  console.log('fetchApi response text:', text.substring(0, 500));
  
  if (!response.ok) {
    try {
      const error = JSON.parse(text);
      throw new Error(error.message || 'Request failed');
    } catch {
      throw new Error(`Request failed: ${response.status}`);
    }
  }
  
  if (!text) return {} as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    return {} as T;
  }
}

export async function login(email: string, password: string): Promise<LoginResult> {
  const url = `${BACKEND_URL}/api/auth/login`;
  console.log('Login request to:', url);
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    const text = await response.text();
    console.log('Login response status:', response.status);
    console.log('Login response text:', text);
    
    if (!response.ok) {
      try {
        const error = JSON.parse(text);
        return { success: false, message: error.message || 'Login failed' };
      } catch {
        return { success: false, message: `Login failed: ${response.status}` };
      }
    }
    
    try {
      const data = JSON.parse(text);
      if (data.success && data.data?.token) {
        setToken(data.data.token);
        const user: User = { id: data.data.id, email: data.data.email, username: data.data.username, avatar: data.data.avatar };
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        console.log('Login success:', user);
        return { success: true };
      }
      return { success: false, message: data.message || 'Login failed' };
    } catch (e) {
      console.error('JSON parse error:', e);
      return { success: false, message: 'Login failed: Invalid response' };
    }
  } catch (error: any) {
    console.error('Login error:', error.message);
    return { success: false, message: error.message || 'Login failed' };
  }
}

export async function register(email: string, username: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetchApi<{ success: boolean; message?: string; data?: { token: string; id: string; email: string; username: string; avatar?: string } }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, username, password }),
    });
    
    if (response.success && response.data?.token) {
      setToken(response.data.token);
      const user: User = { id: response.data.id, email: response.data.email, username: response.data.username, avatar: response.data.avatar };
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return { success: true };
    }
    return { success: false, message: response.message || 'Registration failed' };
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
    const response = await fetchApi<{ success: boolean; data: string[] }>('/api/user/favorites');
    return response.data || [];
  } catch {
    return [];
  }
}

export async function addFavorite(slug: string): Promise<void> {
  await fetchApi(`/api/user/favorites/${slug}`, {
    method: 'POST',
  });
}

export async function removeFavorite(slug: string): Promise<void> {
  await fetchApi(`/api/user/favorites/${slug}`, {
    method: 'DELETE',
  });
}

export async function checkFavorite(slug: string): Promise<boolean> {
  try {
    const response = await fetchApi<{ success: boolean; data: { isFavorite: boolean } }>(`/api/user/favorites/${slug}/check`);
    return response.data?.isFavorite || false;
  } catch {
    return false;
  }
}

export async function getHistory(): Promise<Array<{ slug: string; watchedAt: string }>> {
  try {
    const response = await fetchApi<{ success: boolean; data: Array<{ slug: string; watchedAt: string }> }>('/api/user/history');
    return response.data || [];
  } catch {
    return [];
  }
}

export async function addHistory(slug: string): Promise<void> {
  await fetchApi(`/api/user/history/${slug}`, {
    method: 'POST',
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
    const response = await fetchApi<{ success: boolean; data: Array<{
      id: string;
      userId: string;
      username: string;
      content: string;
      rating: number;
      createdAt: string;
    }> }>(`/api/comments/${slug}`);
    return response.data || [];
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
    const response = await fetchApi<{ success: boolean; data: {
      id: string;
      userId: string;
      username: string;
      content: string;
      rating: number;
      createdAt: string;
    } }>('/api/comments', {
      method: 'POST',
      body: JSON.stringify({ slug, content, rating }),
    });
    return response.data || null;
  } catch {
    return null;
  }
}

export async function deleteComment(commentId: string): Promise<void> {
  await fetchApi(`/api/comments/${commentId}`, {
    method: 'DELETE',
  });
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetchApi<{ success: boolean; data: { status: string } }>('/api/health');
    return response.data?.status === 'OK';
  } catch {
    return false;
  }
}