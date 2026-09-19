import type { ReactNode } from 'react';
import { RowsSkeleton } from '@/components/ui/Skeleton';

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => ReactNode;
  className?: string;
  /** Shown as the card title on small screens */
  primary?: boolean;
  hideOnMobile?: boolean;
}

interface Props<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  empty: ReactNode;
  actions?: (row: T) => ReactNode;
  caption: string;
}

/** Real table from md up; stacked cards on phones (no sideways scrolling). */
export function ResponsiveTable<T>({ columns, rows, rowKey, loading, empty, actions, caption }: Props<T>) {
  if (loading && !rows.length) return <RowsSkeleton rows={6} />;
  if (!rows.length) return <>{empty}</>;

  const primary = columns.find((c) => c.primary) ?? columns[0];
  const rest = columns.filter((c) => c !== primary && !c.hideOnMobile);

  return (
    <div className={loading ? 'opacity-60 transition-opacity' : ''} aria-busy={loading}>
      <div className="hidden overflow-x-auto rounded-3xl bg-white shadow-paper md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">{caption}</caption>
          <thead>
            <tr className="border-b-2 border-dashed border-cream-200 text-xs font-bold text-ink-500">
              {columns.map((c) => (
                <th key={c.key} scope="col" className={`px-5 py-3.5 ${c.className ?? ''}`}>{c.header}</th>
              ))}
              {actions && <th scope="col" className="px-5 py-3.5 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={rowKey(row)} className="border-b border-cream-100 last:border-0 hover:bg-cream/60">
                {columns.map((c) => (
                  <td key={c.key} className={`px-5 py-3.5 align-middle ${c.className ?? ''}`}>{c.render(row)}</td>
                ))}
                {actions && <td className="whitespace-nowrap px-5 py-3 text-right">{actions(row)}</td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="grid gap-3 md:hidden">
        {rows.map((row) => (
          <li key={rowKey(row)} className="rounded-3xl bg-white p-4 shadow-paper">
            <div className="font-display text-base font-semibold">{primary.render(row)}</div>
            <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm">
              {rest.map((c) => (
                <div key={c.key} className="contents">
                  <dt className="text-ink-500">{c.header}</dt>
                  <dd className="min-w-0 text-right">{c.render(row)}</dd>
                </div>
              ))}
            </dl>
            {actions && <div className="mt-3 flex flex-wrap justify-end gap-2 border-t border-dashed border-cream-200 pt-3">{actions(row)}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
}
