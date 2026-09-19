import { Search, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import { EmptyState } from '@/components/ui/EmptyState';

export function PageHeader({ title, lead, action }: { title: string; lead: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-3xl font-semibold">{title}</h1>
        <p className="mt-1 text-ink-500">{lead}</p>
      </div>
      {action}
    </div>
  );
}

export function SearchInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="relative w-full sm:max-w-xs">
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-300" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        maxLength={80}
        className="field-input h-11 py-0 pl-10 pr-10 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button onClick={() => onChange('')} className="absolute right-2 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-full text-ink-300 hover:bg-cream-100" aria-label="Clear search">
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function FilterTabs<T extends string>({ value, options, onChange }: {
  value: T; options: { value: T; label: string }[]; onChange: (v: T) => void;
}) {
  return (
    <div role="tablist" className="inline-flex rounded-full bg-white p-1 shadow-pill">
      {options.map((o) => (
        <button
          key={o.value}
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-bold transition-colors ${value === o.value ? 'bg-teal-500 text-white' : 'text-ink-500 hover:text-ink'}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function IconButton({ label, onClick, children, tone = 'default' }: {
  label: string; onClick: () => void; children: ReactNode; tone?: 'default' | 'danger' | 'success';
}) {
  const tones = {
    default: 'text-ink-500 hover:bg-teal-50 hover:text-teal-700',
    danger: 'text-ink-500 hover:bg-coral-50 hover:text-coral-700',
    success: 'text-ink-500 hover:bg-leaf-50 hover:text-leaf-700',
  };
  return (
    <button onClick={onClick} title={label} aria-label={label} className={`inline-grid h-9 w-9 place-items-center rounded-full transition-colors ${tones[tone]}`}>
      {children}
    </button>
  );
}

export const NoSubmissions = ({ text = 'No submissions yet.' }: { text?: string }) => (
  <div className="rounded-3xl bg-white shadow-paper">
    <EmptyState tone="lilac" icon={<Inbox className="h-9 w-9" />} title={text} text="New entries will show up here." />
  </div>
);
