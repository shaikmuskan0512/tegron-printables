import { ArrowRight } from 'lucide-react';
import { CATEGORY_TONES, CategoryIcon } from '@/components/brand/CategoryIcon';
import { Heart, Sparkle, Star } from '@/components/brand/Doodles';
import { EtsyIcon } from '@/components/brand/SocialIcons';
import { buttonClass } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import type { Product } from '@/types';
import { formatPrice, pickBy } from '@/utils/format';
import { ProductImage } from './ProductImage';

export function ProductModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const tone = pickBy(product?.category?.slug ?? '', CATEGORY_TONES);
  return (
    <Modal open={Boolean(product)} onClose={onClose} title={product?.title} size="xl" hideTitle>
      {product && (
        <div className="grid gap-6 md:grid-cols-[1.1fr_1fr] md:gap-8">
          <div className="relative">
            <Star className="absolute -left-2 -top-2 z-10 h-7 w-7 -rotate-12" />
            <div className="aspect-square overflow-hidden rounded-3xl bg-white p-2 shadow-paper">
              <div className="h-full overflow-hidden rounded-2xl">
                <ProductImage product={product} sizes="(min-width:768px) 480px, 100vw" eager />
              </div>
            </div>
          </div>
          <div className="flex flex-col md:py-4">
            {product.category && (
              <span className={`inline-flex items-center gap-1.5 self-start rounded-full px-3 py-1 text-sm font-bold ${tone.badge}`}>
                <CategoryIcon name={product.category.icon} className="h-4 w-4" />
                {product.category.name}
              </span>
            )}
            <h2 className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{product.title}</h2>
            <p className="mt-2 font-display text-3xl font-bold text-coral-600">{formatPrice(product.price)}</p>
            <div className="dashed-divider my-5" />
            <p className="whitespace-pre-line leading-relaxed text-ink-700">{product.description}</p>

            <ul className="mt-5 space-y-2 text-sm text-ink-700">
              <li className="flex items-center gap-2"><Sparkle className="h-4 w-4 text-sun-500" /> Instant digital download from Etsy</li>
              <li className="flex items-center gap-2"><Heart className="h-4 w-4" /> Print at home as many times as you like</li>
            </ul>

            <div className="mt-auto pt-7">
              <a href={product.etsyUrl} target="_blank" rel="noopener noreferrer" className={buttonClass('primary', 'lg', 'w-full sm:w-auto')}>
                <EtsyIcon className="h-5 w-5" /> View on Etsy <ArrowRight className="h-5 w-5" aria-hidden />
              </a>
              <p className="mt-2 text-xs text-ink-500">Opens the Etsy listing in a new tab.</p>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
