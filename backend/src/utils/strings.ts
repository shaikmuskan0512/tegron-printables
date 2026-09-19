import type { Model } from 'mongoose';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80) || 'item';
}

/** Escape user text before using it inside a RegExp (prevents regex injection / ReDoS). */
export function escapeRegex(input: string): string {
  return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Returns a slug that is unique for the given model, optionally ignoring one document. */
export async function uniqueSlug(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<any>,
  source: string,
  excludeId?: string,
): Promise<string> {
  const base = slugify(source);
  let candidate = base;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const filter: Record<string, unknown> = { slug: candidate };
    if (excludeId) filter._id = { $ne: excludeId };
    const taken = await model.exists(filter);
    if (!taken) return candidate;
    candidate = `${base}-${n++}`;
  }
}

export const isObjectId = (value: string): boolean => /^[a-f\d]{24}$/i.test(value);
