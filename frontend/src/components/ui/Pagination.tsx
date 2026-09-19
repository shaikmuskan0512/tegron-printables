import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
  disabled?: boolean;
}

function pages(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const set = new Set([1, total, current, current - 1, current + 1]);
  const list = [...set].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  list.forEach((n, i) => {
    if (i > 0 && n - list[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

export function Pagination({ page, totalPages, onChange, disabled }: Props) {
  if (totalPages <= 1) return null;
  const btn = 'grid h-10 min-w-10 place-items-center rounded-full px-2 font-display font-semibold transition-colors disabled:opacity-40';
  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1.5">
      <button
        className={`${btn} gap-1 bg-white px-3 shadow-pill hover:bg-teal-50`}
        onClick={() => onChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        <ChevronLeft className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Previous</span>
      </button>
      {pages(page, totalPages).map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-1 text-ink-300" aria-hidden>…</span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            disabled={disabled}
            aria-current={p === page ? 'page' : undefined}
            aria-label={`Page ${p}`}
            className={`${btn} ${p === page ? 'bg-coral-500 text-white shadow-pill' : 'text-ink-700 hover:bg-white'}`}
          >
            {p}
          </button>
        ),
      )}
      <button
        className={`${btn} gap-1 bg-white px-3 shadow-pill hover:bg-teal-50`}
        onClick={() => onChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="h-4 w-4" aria-hidden />
      </button>
    </nav>
  );
}
