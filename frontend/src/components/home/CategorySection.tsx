import { LayoutGrid, RotateCw } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { Leaf, Sprout, Star } from '@/components/brand/Doodles';
import { CATEGORY_TONES, CategoryIcon } from '@/components/brand/CategoryIcon';
import { Skeleton } from '@/components/ui/Skeleton';
import { catalogService } from '@/services/catalog.service';
import { getErrorMessage } from '@/services/api';
import type { Category } from '@/types';
import { pickBy } from '@/utils/format';
import { SectionHeading } from './SectionHeading';

interface Props {
  selected: string;
  onSelect: (slug: string) => void;
}

export function CategorySection({ selected, onSelect }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(() => {
    setLoading(true);
    setError('');
    catalogService
      .listCategories()
      .then(setCategories)
      .catch((e) => setError(getErrorMessage(e, 'Unable to load categories.')))
      .finally(() => setLoading(false));
  }, []);

  useEffect(load, [load]);

  const pill = (active: boolean) =>
    `inline-flex shrink-0 items-center gap-2.5 rounded-full py-2 pl-2 pr-5 font-display text-[15px] font-medium transition-all ${
      active ? 'bg-coral-500 text-white shadow-pill' : 'bg-white text-ink-700 shadow-pill hover:-translate-y-0.5'
    }`;

  return (
    <section id="categories" aria-labelledby="cat-title" className="relative py-14 sm:py-16">
      <Sprout className="pointer-events-none absolute left-[4%] top-10 hidden h-16 w-14 md:block" />
      <Star className="pointer-events-none absolute right-[8%] top-16 hidden h-8 w-8 rotate-12 md:block" />
      <Leaf className="pointer-events-none absolute bottom-6 right-[3%] hidden h-10 w-10 md:block" />
      <div className="page-container">
        <SectionHeading id="cat-title" title="Explore by Category" lead="Find something fun for every little learner." />

        {error ? (
          <div className="mt-8 flex flex-col items-center gap-3 text-center">
            <p className="font-semibold text-coral-700">{error}</p>
            <button onClick={load} className="inline-flex items-center gap-2 font-bold text-teal-700 underline-offset-4 hover:underline">
              <RotateCw className="h-4 w-4" aria-hidden /> Try again
            </button>
          </div>
        ) : (
          <div
            role="group"
            aria-label="Filter printables by category"
            className="-mx-4 mt-8 flex gap-3 overflow-x-auto px-4 pb-3 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0"
          >
            <button className={pill(selected === 'all')} aria-pressed={selected === 'all'} onClick={() => onSelect('all')}>
              <span className={`grid h-9 w-9 place-items-center rounded-full ${selected === 'all' ? 'bg-white/25' : 'bg-coral-50 text-coral-600'}`}>
                <LayoutGrid className="h-[18px] w-[18px]" aria-hidden />
              </span>
              All
            </button>
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[52px] w-36 shrink-0 rounded-full" />)
              : categories.map((c) => {
                  const tone = pickBy(c.slug, CATEGORY_TONES);
                  const active = selected === c.slug;
                  return (
                    <button key={c.id} className={pill(active)} aria-pressed={active} onClick={() => onSelect(c.slug)}>
                      <span className={`grid h-9 w-9 place-items-center rounded-full ${active ? 'bg-white/25' : `${tone.soft} ${tone.icon}`}`}>
                        <CategoryIcon name={c.icon} className="h-[18px] w-[18px]" />
                      </span>
                      {c.name}
                    </button>
                  );
                })}
          </div>
        )}
      </div>
    </section>
  );
}
