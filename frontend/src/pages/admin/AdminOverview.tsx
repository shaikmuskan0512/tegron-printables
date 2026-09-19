import { Lightbulb, MessageCircleQuestion, Package, Plus, RotateCw, Users, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkle } from '@/components/brand/Doodles';
import { PageHeader } from '@/components/admin/AdminUi';
import { Button, buttonClass } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Skeleton } from '@/components/ui/Skeleton';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useAdminAuth } from '@/context/AdminAuthContext';
import { adminService } from '@/services/admin.service';
import { getErrorMessage } from '@/services/api';
import type { DashboardStats } from '@/types';
import { firstName, formatDate } from '@/utils/format';

const KPIS: { key: keyof DashboardStats['stats']; label: string; icon: LucideIcon; tone: string; to: string; sub?: keyof DashboardStats['stats']; subLabel?: string }[] = [
  { key: 'totalUsers', label: 'Users', icon: Users, tone: 'bg-teal-50 text-teal-700', to: '/admin/users' },
  { key: 'totalProducts', label: 'Products', icon: Package, tone: 'bg-sun-50 text-sun-700', to: '/admin/products' },
  { key: 'totalQueries', label: 'Queries', icon: MessageCircleQuestion, tone: 'bg-coral-50 text-coral-700', to: '/admin/queries', sub: 'pendingQueries', subLabel: 'pending' },
  { key: 'totalIdeas', label: 'Ideas', icon: Lightbulb, tone: 'bg-lilac-50 text-lilac-700', to: '/admin/ideas', sub: 'newIdeas', subLabel: 'to review' },
];

export default function AdminOverview() {
  const { admin } = useAdminAuth();
  const [data, setData] = useState<DashboardStats | null>(null);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setError('');
    adminService.stats().then(setData).catch((e) => setError(getErrorMessage(e)));
  }, []);
  useEffect(load, [load]);

  return (
    <>
      <PageHeader
        title={`Hello, ${firstName(admin?.name ?? 'there')}`}
        lead="Here's what's happening across Tegron Printables."
        action={<Link to="/admin/products?new=1" className={buttonClass('primary')}><Plus className="h-4 w-4" aria-hidden /> Add product</Link>}
      />

      {error ? (
        <EmptyState tone="coral" icon={<RotateCw className="h-8 w-8" />} title="Couldn't load the dashboard." text={error} action={<Button variant="teal" onClick={load}>Try again</Button>} />
      ) : (
        <>
          <section className="grid grid-cols-2 gap-3 sm:gap-5 xl:grid-cols-4" aria-label="Key numbers">
            {KPIS.map(({ key, label, icon: Icon, tone, to, sub, subLabel }) => (
              <Link key={key} to={to} className="group rounded-3xl bg-white p-5 shadow-paper transition-shadow hover:shadow-lift">
                <div className="flex items-center justify-between">
                  <span className="font-display font-medium text-ink-700">{label}</span>
                  <span className={`grid h-10 w-10 place-items-center rounded-2xl ${tone}`}><Icon className="h-5 w-5" aria-hidden /></span>
                </div>
                {data ? (
                  <p className="mt-3 font-display text-4xl font-bold">{data.stats[key].toLocaleString()}</p>
                ) : (
                  <Skeleton className="mt-3 h-10 w-20" />
                )}
                {sub && data && (
                  <p className="mt-1 text-sm text-ink-500">{data.stats[sub]} {subLabel}</p>
                )}
              </Link>
            ))}
          </section>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <RecentList
              title="Latest queries"
              to="/admin/queries"
              items={data?.recentQueries.map((q) => ({ id: q.id, title: q.query, who: q.name, date: q.createdAt, status: q.status }))}
            />
            <RecentList
              title="Latest ideas"
              to="/admin/ideas"
              items={data?.recentIdeas.map((i) => ({ id: i.id, title: i.productIdea, who: i.name, date: i.createdAt, status: i.status }))}
            />
          </div>
        </>
      )}
    </>
  );
}

function RecentList({ title, to, items }: {
  title: string; to: string; items?: { id: string; title: string; who: string; date: string; status: string }[];
}) {
  return (
    <section className="rounded-3xl bg-white p-5 shadow-paper sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="inline-flex items-center gap-2 font-display text-xl font-semibold">
          <Sparkle className="h-4 w-4 text-sun-500" /> {title}
        </h2>
        <Link to={to} className="text-sm font-bold text-teal-700 hover:underline">View all</Link>
      </div>
      {!items ? (
        <div className="mt-4 space-y-3">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-12" />)}</div>
      ) : items.length === 0 ? (
        <p className="mt-6 py-6 text-center text-ink-500">No submissions yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-dashed divide-cream-200">
          {items.map((i) => (
            <li key={i.id} className="flex items-center gap-3 py-3">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{i.title}</p>
                <p className="text-xs text-ink-500">{i.who} · {formatDate(i.date)}</p>
              </div>
              <StatusBadge status={i.status} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
