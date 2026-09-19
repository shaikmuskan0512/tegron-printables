import { House, Lightbulb, LogOut, MessageCircleQuestion, UserRound, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, SunFace } from '@/components/brand/Doodles';
import { LogoLockup, Wordmark } from '@/components/brand/Logo';
import { HomePanel, IdeasPanel, ProfilePanel, QueriesPanel, type MemberData } from '@/components/dashboard/Panels';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { getErrorMessage } from '@/services/api';
import { memberService } from '@/services/member.service';
import type { CustomerQuery, Idea } from '@/types';
import { HOME_PATH } from '@/utils/navigation';

type Tab = 'home' | 'queries' | 'ideas' | 'profile';
const TABS: { id: Tab; label: string; short: string; icon: LucideIcon }[] = [
  { id: 'home', label: 'Home', short: 'Home', icon: House },
  { id: 'queries', label: 'My Queries', short: 'Queries', icon: MessageCircleQuestion },
  { id: 'ideas', label: 'My Ideas', short: 'Ideas', icon: Lightbulb },
  { id: 'profile', label: 'Profile', short: 'Profile', icon: UserRound },
];

/** Single-page member space: tabs are kept in ?tab= so links and back/forward work. */
export default function DashboardPage() {
  const { user, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const raw = params.get('tab') as Tab | null;
  const tab: Tab = raw && TABS.some((t) => t.id === raw) ? raw : 'home';

  const [queries, setQueries] = useState<CustomerQuery[]>([]);
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    Promise.all([memberService.myQueries(), memberService.myIdeas()])
      .then(([q, i]) => { setQueries(q); setIdeas(i); })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);
  useEffect(() => { document.title = 'My Dashboard | Tegron Printables'; }, []);

  const setTab = (t: string) => {
    setParams(t === 'home' ? {} : { tab: t });
    window.scrollTo({ top: 0 });
  };

  const onLogout = () => {
    logout();
    toast.success('You have been logged out. See you soon!');
    navigate('/', { replace: true });
  };

  const data: MemberData = { queries, ideas, loading, error, reload: load };

  return (
    <div className="min-h-screen bg-cream lg:p-4">
      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-cream/95 px-4 backdrop-blur lg:hidden">
        <LogoLockup size="sm" />
        <button onClick={onLogout} className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm font-bold text-ink-700 hover:bg-cream-100">
          <LogOut className="h-4 w-4" aria-hidden /> Logout
        </button>
      </header>

      <div className="lg:grid lg:grid-cols-[260px_1fr] lg:gap-6">
        {/* Desktop sidebar */}
        <aside className="relative hidden overflow-hidden rounded-4xl bg-teal-500 p-5 text-white lg:sticky lg:top-4 lg:flex lg:h-[calc(100vh-2rem)] lg:flex-col">
          <Link to={HOME_PATH} className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5" aria-label="Tegron Printables home">
            <SunFace className="h-10 w-10" />
            <span className="leading-none">
              <Wordmark className="text-xl" />
              <span className="block font-display text-xs font-semibold text-ink">Member Space</span>
            </span>
          </Link>
          <nav className="mt-8" aria-label="Dashboard">
            <ul className="space-y-1.5">
              {TABS.map(({ id, label, icon: Icon }) => (
                <li key={id}>
                  <button
                    onClick={() => setTab(id)}
                    aria-current={tab === id ? 'page' : undefined}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 font-display text-[16px] font-medium transition-colors ${
                      tab === id ? 'bg-white text-teal-700 shadow-pill' : 'text-white/90 hover:bg-white/15'
                    }`}
                  >
                    <Icon className="h-5 w-5" aria-hidden /> {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <div className="mt-auto space-y-3">
            <div className="relative rounded-3xl bg-teal-600/60 p-4">
              <Star className="absolute -right-1 -top-2 h-6 w-6" />
              <p className="truncate font-display font-semibold">{user?.name}</p>
              <p className="truncate text-sm text-white/80">{user?.email}</p>
            </div>
            <Link to={HOME_PATH} className="block rounded-2xl px-4 py-2.5 font-display font-medium text-white/90 hover:bg-white/15">Browse printables</Link>
            <button onClick={onLogout} className="flex w-full items-center gap-3 rounded-2xl px-4 py-2.5 font-display font-medium text-white/90 hover:bg-white/15">
              <LogOut className="h-5 w-5" aria-hidden /> Logout
            </button>
          </div>
        </aside>

        <main className="min-w-0 px-4 pb-28 pt-4 sm:px-6 lg:px-4 lg:pb-8 lg:pt-6">
          <div className="mx-auto max-w-5xl">
            {tab === 'home' && <HomePanel data={data} onTab={setTab} />}
            {tab === 'queries' && <QueriesPanel data={data} />}
            {tab === 'ideas' && <IdeasPanel data={data} />}
            {tab === 'profile' && <ProfilePanel />}
          </div>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav aria-label="Dashboard" className="fixed inset-x-3 bottom-3 z-30 rounded-3xl bg-teal-500 p-1.5 shadow-lift lg:hidden">
        <ul className="grid grid-cols-4">
          {TABS.map(({ id, short, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                aria-current={tab === id ? 'page' : undefined}
                className={`flex w-full flex-col items-center gap-0.5 rounded-2xl py-2 text-xs font-bold ${
                  tab === id ? 'bg-white text-teal-700' : 'text-white/90'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden />
                {short}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}