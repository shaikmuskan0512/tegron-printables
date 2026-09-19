import { ArrowRight } from 'lucide-react';
import { memo } from 'react';
import { CATEGORY_TONES } from '@/components/brand/CategoryIcon';
import type { Product } from '@/types';
import { formatPrice, pickBy } from '@/utils/format';
import { ProductImage } from './ProductImage';

const TAPES = ['bg-coral-200', 'bg-sun-200', 'bg-teal-200', 'bg-leaf-200', 'bg-lilac-200'];
const TILTS = ['-rotate-2', 'rotate-1', '-rotate-1', 'rotate-2'];

interface Props {
  product: Product;
  index: number;
  onOpen: (p: Product) => void;
}

/** A printable sheet: washi tape, dog-eared corner, a slight lift on hover. */
export const ProductCard = memo(function ProductCard({ product, index, onOpen }: Props) {
  const tone = pickBy(product.category?.slug ?? '', CATEGORY_TONES);
  return (
    <article className="paper paper-fold group flex flex-col p-3 transition-[transform,box-shadow] duration-200 hover:-translate-y-1 hover:shadow-lift">
      <span className={`washi ${TAPES[index % TAPES.length]} ${TILTS[index % TILTS.length]}`} aria-hidden />
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-cream-100">
        <ProductImage product={product} sizes="(min-width:1280px) 290px, (min-width:768px) 33vw, (min-width:520px) 50vw, 100vw" />
      </div>
      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        {product.category && (
          <span className={`self-start rounded-full px-2.5 py-0.5 text-xs font-bold ${tone.badge}`}>{product.category.name}</span>
        )}
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug">
          {/* Stretched button: the whole card opens details; the Etsy link sits above it */}
          <button onClick={() => onOpen(product)} className="text-left after:absolute after:inset-0 after:rounded-3xl after:content-[''] focus-visible:outline-none">
            {product.title}
          </button>
        </h3>
        <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-ink-500">{product.description}</p>
        <div className="mt-auto flex items-center justify-between gap-2 pt-4">
          <span className="font-display text-xl font-bold">{formatPrice(product.price)}</span>
          <a
            href={product.etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="relative z-10 inline-flex h-9 items-center gap-1.5 rounded-full bg-coral-500 px-4 font-display text-sm font-semibold text-white shadow-pill hover:bg-coral-600"
            aria-label={`View ${product.title} on Etsy (opens in a new tab)`}
          >
            View on Etsy <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>
    </article>
  );
});
