import { useState } from 'react';
import { CATEGORY_TONES, CategoryIcon } from '@/components/brand/CategoryIcon';
import { Star } from '@/components/brand/Doodles';
import type { Product } from '@/types';
import { cloudinaryImage, pickBy } from '@/utils/format';

/** Optimized Cloudinary image, or an illustrated placeholder when none is set. */
export function ProductImage({ product, sizes, eager, className = '' }: {
  product: Product; sizes: string; eager?: boolean; className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const url = product.imageUrl;

  if (url && !failed) {
    return (
      <img
        src={cloudinaryImage(url, 640)}
        srcSet={[400, 640, 960, 1280].map((w) => `${cloudinaryImage(url, w)} ${w}w`).join(', ')}
        sizes={sizes}
        alt={`${product.title} printable preview`}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(true)}
        className={`h-full w-full object-cover ${className}`}
      />
    );
  }

  const tone = pickBy(product.category?.slug ?? product.slug, CATEGORY_TONES);
  return (
    <div className={`relative grid h-full w-full place-items-center overflow-hidden ${tone.soft} ${className}`} role="img" aria-label={`${product.title} printable`}>
      <div className="relative w-[46%] -rotate-3 rounded-lg bg-white p-3 shadow-paper">
        <div className={`mx-auto grid aspect-square w-3/5 place-items-center rounded-full ${tone.badge}`}>
          <CategoryIcon name={product.category?.icon} className="h-1/2 w-1/2" />
        </div>
        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 w-full rounded-full bg-cream-200" />
          <div className="h-1.5 w-2/3 rounded-full bg-cream-200" />
        </div>
      </div>
      <Star className="absolute right-[18%] top-[14%] h-5 w-5 rotate-12" />
      <Star color="#A9CDA0" className="absolute bottom-[14%] left-[16%] h-4 w-4" />
    </div>
  );
}
