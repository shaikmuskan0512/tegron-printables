import { LayoutDashboard, Menu, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogoLockup } from '@/components/brand/Logo';
import { buttonClass } from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { useActiveSection } from '@/hooks/useActiveSection';
import { HOME_PATH, scrollToSection } from '@/utils/navigation';

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'ask', label: 'Ask Us' },
  { id: 'idea', label: 'Give an Idea' },
];

export function Navbar() {
  const { user, admin, loading } = useAuth();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_LINKS.map((l) => l.id));
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    if (pathname !== HOME_PATH) navigate(`${HOME_PATH}#${id}`);
    else {
      scrollToSection(id);
      window.history.replaceState(null, '', id === 'home' ? HOME_PATH : `${HOME_PATH}#${id}`);
    }
  };

  const loginHref = `/?redirect=${encodeURIComponent(pathname)}`;
  // Signed-in admins get a link to their area instead of the customer dashboard.
  const signedIn = Boolean(user || admin);
  const areaHref = admin ? '/admin' : '/dashboard';
  const areaLabel = admin ? 'Admin Studio' : 'My Dashboard';

  return (
    <header
      className={`sticky top-0 z-50 transition-[background-color,box-shadow] ${
        scrolled || open ? 'bg-cream/95 shadow-[0_1px_0_rgba(31,42,68,.06)] backdrop-blur' : 'bg-transparent'
      }`}
    >
      <nav className="page-container flex h-[72px] items-center justify-between gap-4" aria-label="Main">
        <LogoLockup onClick={() => { setOpen(false); if (pathname === HOME_PATH) scrollToSection('home'); }} />

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((l) => (
            <li key={l.id}>
              <a
                href={`${HOME_PATH}#${l.id}`}
                onClick={(e) => { e.preventDefault(); go(l.id); }}
                aria-current={active === l.id ? 'true' : undefined}
                className={`relative rounded-full px-4 py-2 font-display text-[15px] font-medium transition-colors ${
                  active === l.id ? 'text-coral-600' : 'text-ink-700 hover:text-ink'
                }`}
              >
                {l.label}
                {active === l.id && (
                  <span className="absolute inset-x-5 -bottom-0.5 h-[3px] rounded-full bg-coral-400" aria-hidden />
                )}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-2 lg:flex">
          {loading ? (
            <span className="h-11 w-40 animate-pulse rounded-full bg-cream-200" aria-hidden />
          ) : signedIn ? (
            <Link to={areaHref} className={buttonClass('teal')}>
              <LayoutDashboard className="h-4 w-4" aria-hidden /> {areaLabel}
            </Link>
          ) : (
            <>
              <Link to={loginHref} className={buttonClass('secondary')}>Login</Link>
              <Link to="/signup" className={buttonClass('primary')}>Sign Up</Link>
            </>
          )}
        </div>

        <button
          className="grid h-11 w-11 place-items-center rounded-2xl bg-white text-ink shadow-pill lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="fixed inset-x-0 bottom-0 top-[72px] z-40 overflow-y-auto bg-cream lg:hidden">
          <div className="page-container flex min-h-full flex-col pb-8 pt-4">
            <ul className="space-y-1">
              {NAV_LINKS.map((l, i) => (
                <li key={l.id}>
                  <a
                    href={`${HOME_PATH}#${l.id}`}
                    onClick={(e) => { e.preventDefault(); go(l.id); }}
                    className={`flex items-center gap-3 rounded-2xl px-4 py-3.5 font-display text-2xl font-semibold ${
                      active === l.id ? 'bg-white text-coral-600 shadow-pill' : 'text-ink'
                    }`}
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${['bg-teal-500', 'bg-coral-500', 'bg-sun-500', 'bg-leaf-500', 'bg-lilac-500'][i]}`}
                      aria-hidden
                    />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
            <div className="mt-auto grid gap-3 pt-8">
              {signedIn ? (
                <Link to={areaHref} onClick={() => setOpen(false)} className={buttonClass('teal', 'lg')}>
                  <LayoutDashboard className="h-5 w-5" aria-hidden /> {areaLabel}
                </Link>
              ) : (
                <>
                  <Link to="/signup" onClick={() => setOpen(false)} className={buttonClass('primary', 'lg')}>Create an account</Link>
                  <Link to={loginHref} onClick={() => setOpen(false)} className={buttonClass('secondary', 'lg')}>Login</Link>
                </>
              )}
              <p className="text-center font-hand text-lg text-ink-500">Print, play, learn, repeat</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}