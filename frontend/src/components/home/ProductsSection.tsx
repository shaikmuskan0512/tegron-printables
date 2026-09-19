import { Loader2, RotateCw, Search, SearchX, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Heart, Leaf, Star, Wave } from '@/components/brand/Doodles';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { Pagination } from '@/components/ui/Pagination';
import { ProductCardSkeleton } from '@/components/ui/Skeleton';
import { useDebounce } from '@/hooks/useDebounce';
import { useProducts } from '@/hooks/useProducts';
import type { Product } from '@/types';
import { scrollToSection } from '@/utils/navigation';
import { ProductCard } from './ProductCard';
import { ProductModal } from './ProductModal';
import { SectionHeading } from './SectionHeading';

const PAGE_SIZE = 12;

export function ProductsSection({ category, onResetCategory }: { category: string; onResetCategory: () => void }) {
  const [term, setTerm] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState<Product | null>(null);
  const search = useDebounce(term.trim(), 350);
  const inputRef = useRef<HTMLInputElement>(null);

  // Any new filter starts at page 1
  useEffect(() => setPage(1), [search, category]);

  const { products, totalPages, totalProducts, currentPage, loading, error, reload } = useProducts({
    search, category, page, limit: PAGE_SIZE,
  });

  const changePage = (p: number) => {
    setPage(p);
    scrollToSection('products');
  };

  const filtered = Boolean(search) || category !== 'all';

  return (
    <section id="products" aria-labelledby="products-title" className="relative">
      <Wave fill="#FBF5EA" />
      <div className="relative bg-cream-100 pb-16 pt-8 sm:pb-20">
        <Star className="pointer-events-none absolute left-[2%] top-24 hidden h-9 w-9 -rotate-12 xl:block" />
        <Heart className="pointer-events-none absolute right-[2%] top-40 hidden h-6 w-6 rotate-12 xl:block" />
        <Leaf className="pointer-events-none absolute bottom-16 right-[3%] hidden h-12 w-12 xl:block" />

        <div className="page-container">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <SectionHeading id="products-title" title="Explore Our Printables" lead="Little activities made for big smiles." align="left" />

            <form role="search" onSubmit={(e) => e.preventDefault()} className="relative w-full md:w-[360px]">
              <label htmlFor="product-search" className="sr-only">Search printables by title</label>
              <input
                ref={inputRef}
                id="product-search"
                type="search"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                maxLength={80}
                placeholder="Search for a printable..."
                className="h-14 w-full rounded-full border-2 border-white bg-white pl-5 pr-24 text-[15px] shadow-pill placeholder:text-ink-300 focus:border-teal-300 focus:outline-none focus:ring-4 focus:ring-teal-100 [&::-webkit-search-cancel-button]:hidden"
              />
              {term && (
                <button
                  type="button"
                  onClick={() => { setTerm(''); inputRef.current?.focus(); }}
                  className="absolute right-14 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full text-ink-300 hover:bg-cream-100 hover:text-ink"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              <span className="pointer-events-none absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full bg-teal-500 text-white">
                {loading && search ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <Search className="h-5 w-5" aria-hidden />}
              </span>
            </form>
          </div>

          <p className="mt-6 min-h-[1.5rem] text-sm font-semibold text-ink-500" aria-live="polite">
            {!loading && !error && (
              filtered
                ? `${totalProducts} printable${totalProducts === 1 ? '' : 's'} found${search ? ` for “${search}”` : ''}`
                : `${totalProducts} printable${totalProducts === 1 ? '' : 's'} to explore`
            )}
          </p>

          {error ? (
            <EmptyState
              tone="coral"
              icon={<RotateCw className="h-9 w-9" />}
              title="Unable to load products."
              text={error}
              action={<Button variant="teal" onClick={reload}>Try again</Button>}
            />
          ) : loading && products.length === 0 ? (
            <div className="mt-4 grid gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <EmptyState
              tone="sun"
              icon={<SearchX className="h-9 w-9" />}
              title="No printables found"
              text="Try searching for something a little different."
              action={
                filtered ? (
                  <Button variant="secondary" onClick={() => { setTerm(''); onResetCategory(); }}>Show all printables</Button>
                ) : undefined
              }
            />
          ) : (
            <div
              className={`mt-4 grid gap-x-6 gap-y-8 transition-opacity sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 ${loading ? 'opacity-60' : ''}`}
              aria-busy={loading}
            >
              {products.map((p, i) => <ProductCard key={p.id} product={p} index={i} onOpen={setOpen} />)}
            </div>
          )}

          <div className="mt-12">
            <Pagination page={currentPage} totalPages={totalPages} onChange={changePage} disabled={loading} />
          </div>
        </div>
      </div>
      <Wave fill="#FBF5EA" flip />
      <ProductModal product={open} onClose={() => setOpen(null)} />
    </section>
  );
}
