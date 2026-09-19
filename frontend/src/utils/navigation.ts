/** The public storefront. "/" is the login page, so the storefront lives here. */
export const HOME_PATH = '/home';

/**
 * Only allow in-app redirects (blocks open-redirects like //evil.com).
 * Never redirect to /admin (admins are routed there by role), or to the login
 * page itself ("/" or its old "/login" alias), which would loop.
 */
export function safeRedirect(value: string | null, fallback = '/dashboard'): string {
  if (!value) return fallback;
  if (!value.startsWith('/') || value.startsWith('//') || value.includes('\\')) return fallback;
  if (value.startsWith('/admin') || value.startsWith('/login')) return fallback;
  if (/^\/(?:[?#]|$)/.test(value)) return fallback;
  return value;
}

const DRAFT_PREFIX = 'tp_draft_';
export const drafts = {
  save(key: string, value: Record<string, string>) {
    try { sessionStorage.setItem(DRAFT_PREFIX + key, JSON.stringify(value)); } catch { /* ignore */ }
  },
  take(key: string): Record<string, string> | null {
    try {
      const raw = sessionStorage.getItem(DRAFT_PREFIX + key);
      sessionStorage.removeItem(DRAFT_PREFIX + key);
      return raw ? (JSON.parse(raw) as Record<string, string>) : null;
    } catch {
      return null;
    }
  },
};

export function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
}