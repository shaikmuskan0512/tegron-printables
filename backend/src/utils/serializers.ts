/**
 * Explicit response shapes. Nothing leaves the API unless it is listed here,
 * so password hashes, Cloudinary ids and internal fields can never leak by accident.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

const idOf = (v: any): string => (v && v._id ? String(v._id) : String(v));

export const serializeUser = (u: any) => ({
  name: u.name as string,
  email: u.email as string,
  joinedAt: u.createdAt as Date,
});

export const serializeCategory = (c: any) => ({
  id: idOf(c),
  name: c.name as string,
  slug: c.slug as string,
  icon: (c.icon as string) || 'sparkles',
  createdAt: c.createdAt as Date,
});

export const serializeProduct = (p: any) => ({
  id: idOf(p),
  title: p.title as string,
  slug: p.slug as string,
  description: p.description as string,
  price: p.price as number,
  imageUrl: (p.imageUrl as string) || '',
  etsyUrl: p.etsyUrl as string,
  category:
    p.category && typeof p.category === 'object' && 'name' in p.category
      ? serializeCategory(p.category)
      : null,
  createdAt: p.createdAt as Date,
  updatedAt: p.updatedAt as Date,
});

export const serializeQuery = (q: any, opts: { includeUser?: boolean } = {}) => ({
  id: idOf(q),
  name: q.name as string,
  email: q.email as string,
  query: q.query as string,
  status: q.status as string,
  createdAt: q.createdAt as Date,
  updatedAt: q.updatedAt as Date,
  ...(opts.includeUser && q.user && typeof q.user === 'object' && 'name' in q.user
    ? { user: { id: idOf(q.user), name: q.user.name, email: q.user.email } }
    : {}),
});

export const serializeIdea = (i: any, opts: { includeUser?: boolean } = {}) => ({
  id: idOf(i),
  name: i.name as string,
  email: i.email as string,
  productIdea: i.productIdea as string,
  description: i.description as string,
  status: i.status as string,
  createdAt: i.createdAt as Date,
  updatedAt: i.updatedAt as Date,
  ...(opts.includeUser && i.user && typeof i.user === 'object' && 'name' in i.user
    ? { user: { id: idOf(i.user), name: i.user.name, email: i.user.email } }
    : {}),
});
