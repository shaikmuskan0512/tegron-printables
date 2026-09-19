const currency = import.meta.env.VITE_CURRENCY || 'USD';
const priceFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency });
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatPrice = (n: number) => priceFmt.format(n);
export const formatDate = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};
export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? name;

/** Cloudinary delivery transformation: auto format/quality, resized. */
export function cloudinaryImage(url: string, width: number): string {
  if (!url || !url.includes('res.cloudinary.com') || !url.includes('/upload/')) return url;
  return url.replace('/upload/', `/upload/f_auto,q_auto,c_limit,w_${width}/`);
}

/** Stable pick from a list based on a string (keeps colors consistent per category). */
export function pickBy<T>(key: string, list: readonly T[]): T {
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return list[h % list.length];
}

export const social = {
  etsy: import.meta.env.VITE_ETSY_URL || '',
  instagram: import.meta.env.VITE_INSTAGRAM_URL || '',
  pinterest: import.meta.env.VITE_PINTEREST_URL || '',
  youtube: import.meta.env.VITE_YOUTUBE_URL || '',
  email: import.meta.env.VITE_CONTACT_EMAIL || '',
};
