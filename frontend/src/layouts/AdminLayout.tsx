import {
  FolderHeart, House, Lightbulb, LogOut, Menu, MessageCircleQuestion, Package, Users, X, type LucideIcon,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { SunFace } from '@/components/brand/Doodles';
import { Wordmark } from '@/components/brand/Logo';
import { useAdminAuth } from '@/context/AdminAuthContext';

const NAV: { to: string; label: string; icon: LucideIcon; end?: boolean }[] = [
  { to: '/admin', label: 'Overview', icon: House, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: FolderHeart },
  { to: '/admin/queries', label: 'Queries', icon: MessageCircleQuestion },
  { to: '/admin/ideas', label: 'Ideas', icon: Lightbulb },
];

function Brand() {
  return (
    <Link to="/admin" className="flex items-center gap-2.5">
      <SunFace className="h-10 w-10" />
      <span className="leading-none">
        <Wordmark className="text-xl" />
        <span className="block font-display text-xs font-semibold text-white/80">Studio admin</span>
      </span>
    </Link>
  );
}

export default function AdminLayout() {
  const { admin, logout } = useAdminAuth();
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => { setOpen(false); window.scrollTo({ top: 0 }); }, [pathname]);
  useEffect(() => { document.title = 'Admin | Tegron Printables'; }, []);

  const signOut = () => { logout(); navigate('/', { replace: true }); };

  const nav = (
    <>
      <nav className="mt-8" aria-label="Admin">
        <ul className="space-y-1">
          {NAV.map(({ to, label, icon: Icon, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-2.5 font-display font-medium transition-colors ${
                    isActive ? 'bg-teal-500 text-white' : 'text-white/75 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon className="h-5 w-5" aria-hidden /> {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto border-t border-white/10 pt-4">
        <p className="truncate px-2 font-display font-semibold">{admin?.name}</p>
        <p className="truncate px-2 text-sm text-white/60">{admin?.email}</p>
        <button onClick={signOut} className="mt-3 flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 font-display font-medium text-white/75 hover:bg-white/10 hover:text-white">
          <LogOut className="h-5 w-5" aria-hidden /> Log out
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-cream-100 lg:grid lg:grid-cols-[250px_1fr]">
      <aside className="sticky top-0 hidden h-screen flex-col bg-ink p-5 text-white lg:flex">
        <Brand />
        {nav}
      </aside>

      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-ink px-4 text-white lg:hidden">
        <Brand />
        <button onClick={() => setOpen(true)} className="grid h-10 w-10 place-items-center rounded-xl bg-white/10" aria-label="Open menu" aria-expanded={open}>
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setOpen(false)} aria-hidden />
          <aside className="absolute inset-y-0 left-0 flex w-72 max-w-[85vw] animate-pop-in flex-col bg-ink p-5 text-white">
            <div className="flex items-center justify-between">
              <Brand />
              <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl bg-white/10" aria-label="Close menu">
                <X className="h-5 w-5" />
              </button>
            </div>
            {nav}
          </aside>
        </div>
      )}

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
}