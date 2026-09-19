import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { SunFace } from '@/components/brand/Doodles';
import { useAuth } from '@/context/AuthContext';

export function FullPageLoader({ label = 'Loading' }: { label?: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-cream" role="status" aria-label={label}>
      <SunFace className="h-20 w-20 animate-pulse" />
    </div>
  );
}

/** Customer-only pages. Admins are sent to /admin, signed-out visitors to the login page. */
export function RequireUser({ children }: { children: ReactNode }) {
  const { user, role, loading } = useAuth();
  const { pathname, search } = useLocation();
  if (loading) return <FullPageLoader />;
  if (role === 'admin') return <Navigate to="/admin" replace />;
  if (!user) return <Navigate to={`/?redirect=${encodeURIComponent(pathname + search)}`} replace />;
  return <>{children}</>;
}

/** Admin-only pages. Anyone else goes to the single login page ("/"). */
export function RequireAdmin({ children }: { children: ReactNode }) {
  const { admin, loading } = useAuth();
  if (loading) return <FullPageLoader />;
  if (!admin) return <Navigate to="/" replace />;
  return <>{children}</>;
}

/** Old login URLs (/login, /admin/login) forward to "/", keeping ?redirect=. */
export function RedirectToLogin() {
  const { search } = useLocation();
  return <Navigate to={`/${search}`} replace />;
}