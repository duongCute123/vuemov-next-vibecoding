const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://vuemov-backend.onrender.com';

let _token: string | null = null;
let _user: User | null = null;

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
  const token = _token;
  const url = `${BACKEND_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const text = await response.text();

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
  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      _token = data.data.token;
      _user = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        avatar: data.data.avatar,
      };
      return { success: true };
    }

    return { success: false, message: data.message || 'Login failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

export async function register(email: string, username: string, password: string): Promise<LoginResult> {
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await response.json();

    if (data.success && data.data?.token) {
      _token = data.data.token;
      _user = {
        id: data.data.id,
        email: data.data.email,
        username: data.data.username,
        avatar: data.data.avatar,
      };
      return { success: true };
    }

    return { success: false, message: data.message || 'Registration failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

export function logout(): void {
  _token = null;
  _user = null;
  fetch('/api/auth/logout', { method: 'POST' }).catch(() => {});
}

export function getToken(): string | null {
  return _token;
}

export function setToken(token: string | null): void {
  _token = token;
}

export function getCurrentUser(): User | null {
  return _user;
}

export function setCurrentUser(user: User | null): void {
  _user = user;
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

export async function updateProfile(data: { username?: string; avatar?: string }): Promise<LoginResult> {
  try {
    const response = await fetch('/api/auth/update', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const result = await response.json();
    if (result.success) {
      if (result.data) {
        _user = {
          id: result.data.id,
          email: result.data.email,
          username: result.data.username,
          avatar: result.data.avatar,
        };
      }
      return { success: true };
    }
    return { success: false, message: result.message || 'Update failed' };
  } catch (error: any) {
    return { success: false, message: error.message || 'Update failed' };
  }
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<LoginResult> {
  try {
    const response = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const result = await response.json();
    return { success: result.success, message: result.message };
  } catch (error: any) {
    return { success: false, message: error.message || 'Change password failed' };
  }
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetchApi<{ success: boolean; data: { status: string } }>('/api/health');
    return response.data?.status === 'OK';
  } catch {
    return false;
  }
}
