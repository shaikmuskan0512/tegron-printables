import { useAuth } from './AuthContext';

/**
 * Admin view of the single app-wide session (see AuthContext). There is no
 * separate admin provider and no separate admin login: admins sign in on "/".
 * `admin` is null unless the signed-in identity is an admin.
 */
export function useAdminAuth() {
  const { admin, loading, logout } = useAuth();
  return { admin, loading, logout };
}