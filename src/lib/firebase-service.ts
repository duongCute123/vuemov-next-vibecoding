import {
  getFavorites as apiGetFavorites,
  addFavorite as apiAddFavorite,
  removeFavorite as apiRemoveFavorite,
  getHistory as apiGetHistory,
  addHistory as apiAddHistory,
  removeHistory as apiRemoveHistory,
  clearHistory as apiClearHistory,
  getComments as apiGetComments,
  addComment as apiAddComment,
  deleteComment as apiDeleteComment,
  checkFavorite as apiCheckFavorite,
  getToken,
} from './api-service';

interface HistoryItem {
  slug: string;
  watchedAt: string;
}

interface Comment {
  id: string;
  userId: string;
  username: string;
  content: string;
  rating: number;
  createdAt: string;
}

export async function getFavorites(): Promise<string[]> {
  const token = getToken();
  if (!token) return [];
  return apiGetFavorites();
}

export async function addFavorite(slug: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  return apiAddFavorite(slug);
}

export async function removeFavorite(slug: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  return apiRemoveFavorite(slug);
}

export async function checkFavorite(slug: string): Promise<boolean> {
  const token = getToken();
  if (!token) return false;
  return apiCheckFavorite(slug);
}

export async function getHistory(): Promise<HistoryItem[]> {
  const token = getToken();
  if (!token) return [];
  return apiGetHistory();
}

export async function addHistory(slug: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  return apiAddHistory(slug);
}

export async function removeHistory(slug: string): Promise<void> {
  const token = getToken();
  if (!token) return;
  return apiRemoveHistory(slug);
}

export async function clearHistory(): Promise<void> {
  const token = getToken();
  if (!token) return;
  return apiClearHistory();
}

export async function getComments(slug: string): Promise<Comment[]> {
  return apiGetComments(slug);
}

export async function addComment(
  slug: string,
  userId: string,
  username: string,
  content: string,
  rating: number = 0
): Promise<Comment[]> {
  const result = await apiAddComment(slug, content, rating);
  return result ? [result] : [];
}

export async function deleteComment(slug: string, commentId: string): Promise<void> {
  return apiDeleteComment(commentId, slug);
}
