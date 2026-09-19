import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { adminService } from '@/services/admin.service';
import { adminToken, userToken } from '@/services/api';
import { authService, memberService, type Role } from '@/services/member.service';
import type { Admin, User } from '@/types';

/** What a successful login returns, so the caller can redirect by role. */
export type LoginResult =
  | { role: 'user'; user: User }
  | { role: 'admin'; admin: Admin };

interface AuthState {
  /** Set only for a signed-in customer. */
  user: User | null;
  /** Set only for a signed-in admin. */
  admin: Admin | null;
  role: Role | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<LoginResult>;
  signup: (name: string, email: string, password: string) => Promise<User>;
  logout: () => void;
  updateName: (name: string) => Promise<User>;
}

const AuthContext = createContext<AuthState | null>(null);

/**
 * Restore a saved session. An admin token is tried first, then a customer token.
 * A token that no longer validates is discarded.
 */
async function restoreSession(): Promise<{ user: User | null; admin: Admin | null }> {
  if (adminToken.get()) {
    try {
      const admin = await adminService.me();
      userToken.clear(); // one identity per browser
      return { admin, user: null };
    } catch {
      adminToken.clear();
    }
  }
  if (userToken.get()) {
    try {
      return { user: await authService.me(), admin: null };
    } catch {
      userToken.clear();
    }
  }
  return { user: null, admin: null };
}

/**
 * One session for the whole app. Customers and admins sign in through the same
 * login call; the backend says which one it was. Tokens stay in separate storage
 * keys (and are used by separate axios clients), so audience separation is kept.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(() => Boolean(adminToken.get() || userToken.get()));

  useEffect(() => {
    if (!adminToken.get() && !userToken.get()) return;
    let cancelled = false;
    restoreSession()
      .then((s) => {
        if (cancelled) return;
        setUser(s.user);
        setAdmin(s.admin);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // An API client saw a 401 for a stored token: drop that identity.
  useEffect(() => {
    const onUserExpire = () => setUser(null);
    const onAdminExpire = () => setAdmin(null);
    window.addEventListener('tp:user-logout', onUserExpire);
    window.addEventListener('tp:admin-logout', onAdminExpire);
    return () => {
      window.removeEventListener('tp:user-logout', onUserExpire);
      window.removeEventListener('tp:admin-logout', onAdminExpire);
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<LoginResult> => {
    const res = await authService.login({ email, password });
    if (res.role === 'admin') {
      userToken.clear();
      adminToken.set(res.token);
      setUser(null);
      setAdmin(res.admin);
      return { role: 'admin', admin: res.admin };
    }
    adminToken.clear();
    userToken.set(res.token);
    setAdmin(null);
    setUser(res.user);
    return { role: 'user', user: res.user };
  }, []);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const res = await authService.signup({ name, email, password });
    adminToken.clear();
    userToken.set(res.token);
    setAdmin(null);
    setUser(res.user);
    return res.user;
  }, []);

  const logout = useCallback(() => {
    userToken.clear();
    adminToken.clear();
    setUser(null);
    setAdmin(null);
  }, []);

  const updateName = useCallback(async (name: string) => {
    const u = await memberService.updateProfile(name);
    setUser(u);
    return u;
  }, []);

  const role: Role | null = admin ? 'admin' : user ? 'user' : null;

  const value = useMemo(
    () => ({ user, admin, role, loading, login, signup, logout, updateName }),
    [user, admin, role, loading, login, signup, logout, updateName],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}