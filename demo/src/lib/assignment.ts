import { Variant } from './types';

// Simple hash function for deterministic assignment
function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash = hash & hash;
  }
  return Math.abs(hash);
}

// Get variant based on user ID
export function getVariant(userId: string): Variant {
  const hash = hashCode(userId);
  return hash % 2 === 0 ? 'control' : 'treatment';
}

// Generate a unique user ID
export function generateUserId(): string {
  return 'user_' + Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// Generate a session ID
export function generateSessionId(): string {
  return 'session_' + Math.random().toString(36).substring(2, 15) +
         Date.now().toString(36);
}

// Persist variant in localStorage
export function persistVariant(userId: string, variant: Variant): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`variant_${userId}`, variant);
    // Also set a cookie for server-side access
    document.cookie = `variant_${userId}=${variant}; max-age=31536000; path=/`;
  }
}

// Get persisted variant
export function getPersistedVariant(userId: string): Variant | null {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(`variant_${userId}`);
    if (stored === 'control' || stored === 'treatment') {
      return stored;
    }
  }
  return null;
}

// Force a specific variant (for testing)
export function forceVariant(userId: string, variant: Variant): void {
  persistVariant(userId, variant);
}
