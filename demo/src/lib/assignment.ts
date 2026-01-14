import { Variant } from './types';

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

export function getVariant(userId: string): Variant {
  const hash = hashCode(userId);
  return hash % 2 === 0 ? 'control' : 'treatment';
}

export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

export function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

export function persistVariant(userId: string, variant: Variant): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`variant_${userId}`, variant);
    document.cookie = `variant_${userId}=${variant}; max-age=31536000; path=/`;
  }
}

export function getPersistedVariant(userId: string): Variant | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`variant_${userId}`);
    if (stored === 'control' || stored === 'treatment') {
      return stored;
    }
  }
  return null;
}
