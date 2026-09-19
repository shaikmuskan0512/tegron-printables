import { CalendarDays, ChevronRight } from 'lucide-react';
import { useState, type ReactNode } from 'react';
import { Modal } from '@/components/ui/Modal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import type { CustomerQuery, Idea } from '@/types';
import { formatDate } from '@/utils/format';

type Item = CustomerQuery | Idea;
const isIdea = (i: Item): i is Idea => 'productIdea' in i;

export function SubmissionList({ items, empty, limit }: { items: Item[]; empty: ReactNode; limit?: number }) {
  const [open, setOpen] = useState<Item | null>(null);
  const shown = limit ? items.slice(0, limit) : items;
  if (!items.length) return <>{empty}</>;

  return (
    <>
      <ul className="grid gap-3">
        {shown.map((item) => (
          <li key={item.id} className="min-w-0">
            <button
              onClick={() => setOpen(item)}
              className="group flex w-full items-center gap-4 rounded-3xl bg-white p-4 text-left shadow-paper transition-shadow hover:shadow-lift sm:p-5"
            >
              <span className={`hidden h-11 w-1.5 shrink-0 rounded-full sm:block ${isIdea(item) ? 'bg-coral-300' : 'bg-teal-300'}`} aria-hidden />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-display text-[17px] font-semibold">
                  {isIdea(item) ? item.productIdea : item.query}
                </span>
                {isIdea(item) && <span className="mt-0.5 block truncate text-sm text-ink-500">{item.description}</span>}
                <span className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-ink-500">
                  <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" aria-hidden /> {formatDate(item.createdAt)}</span>
                  <StatusBadge status={item.status} />
                </span>
              </span>
              <ChevronRight className="h-5 w-5 shrink-0 text-ink-300 transition-transform group-hover:translate-x-0.5" aria-hidden />
              <span className="sr-only">View details</span>
            </button>
          </li>
        ))}
      </ul>

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open && isIdea(open) ? 'Your idea' : 'Your question'}>
        {open && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-500">
              <StatusBadge status={open.status} />
              <span>Submitted {formatDate(open.createdAt)}</span>
            </div>
            {isIdea(open) ? (
              <>
                <h3 className="font-display text-2xl font-semibold">{open.productIdea}</h3>
                <p className="whitespace-pre-line break-words rounded-2xl bg-white p-4 leading-relaxed">{open.description}</p>
              </>
            ) : (
              <p className="whitespace-pre-line break-words rounded-2xl bg-white p-4 leading-relaxed">{open.query}</p>
            )}
            <p className="text-sm text-ink-500">
              Sent as {open.name} · {open.email}
            </p>
            <p className="rounded-2xl bg-sun-50 p-3 text-sm text-ink-700">
              {open.status === 'pending' && "We've got your question and will reply by email."}
              {open.status === 'resolved' && 'This question has been answered. Check your inbox!'}
              {open.status === 'submitted' && "Thanks! We'll take a look at your idea soon."}
              {open.status === 'reviewed' && 'Our team has reviewed your idea. Thank you for inspiring us!'}
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}
