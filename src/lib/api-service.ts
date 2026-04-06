'use client';

import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  doc, getDoc, setDoc, updateDoc, deleteDoc, 
  collection, query, where, getDocs, addDoc, serverTimestamp 
} from 'firebase/firestore';
import { auth, db } from './firebase';

const TOKEN_KEY = 'nhungmov_token';
const USER_KEY = 'nhungmov_user';

export interface LoginResult {
  success: boolean;
  message?: string;
}

export async function login(email: string, password: string): Promise<LoginResult> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    setToken(token);
    const userData = {
      id: userCredential.user.uid,
      email: userCredential.user.email || email,
      username: email.split('@')[0]
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Login failed' };
  }
}

export async function register(email: string, username: string, password: string): Promise<LoginResult> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', userCredential.user.uid), {
      email,
      username,
      createdAt: serverTimestamp()
    });
    const token = await userCredential.user.getIdToken();
    setToken(token);
    const userData = {
      id: userCredential.user.uid,
      email,
      username
    };
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    return { success: true };
  } catch (error: any) {
    return { success: false, message: error.message || 'Registration failed' };
  }
}

export function logout(): void {
  firebaseSignOut(auth);
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

export function getCurrentUser(): { id: string; email: string; username: string } | null {
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
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const q = query(collection(db, 'favorites'), where('userId', '==', user.id));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => doc.data().slug);
  } catch {
    return [];
  }
}

export async function addFavorite(slug: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  const q = query(collection(db, 'favorites'), where('userId', '==', user.id), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) {
    await addDoc(collection(db, 'favorites'), {
      userId: user.id,
      slug,
      createdAt: serverTimestamp()
    });
  }
}

export async function removeFavorite(slug: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  const q = query(collection(db, 'favorites'), where('userId', '==', user.id), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
}

export async function checkFavorite(slug: string): Promise<boolean> {
  const user = getCurrentUser();
  if (!user) return false;
  const q = query(collection(db, 'favorites'), where('userId', '==', user.id), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  return !snapshot.empty;
}

export async function getHistory(): Promise<Array<{ slug: string; watchedAt: string }>> {
  const user = getCurrentUser();
  if (!user) return [];
  try {
    const q = query(collection(db, 'history'), where('userId', '==', user.id));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      slug: doc.data().slug,
      watchedAt: doc.data().watchedAt?.toDate?.()?.toISOString() || new Date().toISOString()
    })).sort((a, b) => new Date(b.watchedAt).getTime() - new Date(a.watchedAt).getTime());
  } catch {
    return [];
  }
}

export async function addHistory(slug: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  const q = query(collection(db, 'history'), where('userId', '==', user.id), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (!snapshot.empty) {
    await updateDoc(snapshot.docs[0].ref, { watchedAt: serverTimestamp() });
  } else {
    await addDoc(collection(db, 'history'), {
      userId: user.id,
      slug,
      watchedAt: serverTimestamp()
    });
  }
}

export async function removeHistory(slug: string): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  const q = query(collection(db, 'history'), where('userId', '==', user.id), where('slug', '==', slug));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
}

export async function clearHistory(): Promise<void> {
  const user = getCurrentUser();
  if (!user) return;
  const q = query(collection(db, 'history'), where('userId', '==', user.id));
  const snapshot = await getDocs(q);
  for (const docSnap of snapshot.docs) {
    await deleteDoc(docSnap.ref);
  }
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
    const q = query(collection(db, 'comments'), where('slug', '==', slug));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId || '',
        username: data.username || '',
        content: data.content || '',
        rating: data.rating || 0,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
      };
    }).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
  const user = getCurrentUser();
  if (!user) return null;
  try {
    const docRef = await addDoc(collection(db, 'comments'), {
      slug,
      userId: user.id,
      username: user.username,
      content,
      rating,
      createdAt: serverTimestamp()
    });
    return {
      id: docRef.id,
      userId: user.id,
      username: user.username,
      content,
      rating,
      createdAt: new Date().toISOString()
    };
  } catch {
    return null;
  }
}

export async function deleteComment(commentId: string, _slug: string): Promise<void> {
  await deleteDoc(doc(db, 'comments', commentId));
}