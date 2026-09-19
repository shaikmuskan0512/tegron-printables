import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { FullPageLoader, RedirectToLogin, RequireAdmin, RequireUser } from '@/components/RouteGuards';
import HomePage from '@/pages/HomePage';
import LoginPage from '@/pages/LoginPage';

const SignupPage = lazy(() => import('@/pages/SignupPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// The admin app is a separate bundle, only loaded on /admin routes
const AdminLayout = lazy(() => import('@/layouts/AdminLayout'));
const AdminOverview = lazy(() => import('@/pages/admin/AdminOverview'));
const AdminUsers = lazy(() => import('@/pages/admin/AdminUsers'));
const AdminProducts = lazy(() => import('@/pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('@/pages/admin/AdminCategories'));
const AdminQueries = lazy(() => import('@/pages/admin/AdminQueries'));
const AdminIdeas = lazy(() => import('@/pages/admin/AdminIdeas'));

export default function App() {
  return (
    <Suspense fallback={<FullPageLoader />}>
      <Routes>
        {/* "/" is the one login page for customers and admins; the backend decides the role. */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/dashboard" element={<RequireUser><DashboardPage /></RequireUser>} />

        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminOverview />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="queries" element={<AdminQueries />} />
          <Route path="ideas" element={<AdminIdeas />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* No separate admin login: old URLs forward to "/" */}
        <Route path="/login" element={<RedirectToLogin />} />
        <Route path="/admin/login" element={<RedirectToLogin />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}