import { z } from 'zod';

// Mirrors backend/src/validators so users get the same messages before sending.
export const nameField = z.string().trim().min(2, 'Name must be at least 2 characters').max(60, 'Name must be 60 characters or fewer');
export const emailField = z.string().trim().min(1, 'Email is required').max(254).email('Please enter a valid email address');
export const passwordField = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer')
  .regex(/[A-Za-z]/, 'Password must include a letter')
  .regex(/\d/, 'Password must include a number');

export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, 'Password is required'),
});

export const signupSchema = z
  .object({ name: nameField, email: emailField, password: passwordField, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] });

export const querySchema = z.object({
  name: nameField,
  email: emailField,
  query: z.string().trim().min(10, 'Your question should be at least 10 characters').max(2000, 'Please keep it under 2000 characters'),
});

export const ideaSchema = z.object({
  name: nameField,
  email: emailField,
  productIdea: z.string().trim().min(3, 'Give your idea a short title (3+ characters)').max(120, 'Please keep the title under 120 characters'),
  description: z.string().trim().min(10, 'Tell us a little more (10+ characters)').max(2000, 'Please keep it under 2000 characters'),
});

export const ACCEPTED_IMAGES = ['image/jpeg', 'image/png', 'image/webp'];
export const MAX_IMAGE_MB = 5;

export const productSchema = z.object({
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v), 'Enter a price like 3.99')
    .refine((v) => Number(v) <= 10000, 'Price looks too high'),
  category: z.string().min(1, 'Choose a category'),
  etsyUrl: z
    .string()
    .trim()
    .url('Enter a valid URL')
    .refine((v) => {
      try {
        const u = new URL(v);
        return u.protocol === 'https:' && (u.hostname === 'etsy.com' || u.hostname.endsWith('.etsy.com') || u.hostname === 'etsy.me');
      } catch {
        return false;
      }
    }, 'Use an https Etsy link (etsy.com)'),
});

export function validateImage(file: File): string | null {
  if (!ACCEPTED_IMAGES.includes(file.type)) return 'Please choose a JPG, PNG or WebP image.';
  if (file.size > MAX_IMAGE_MB * 1024 * 1024) return `Image must be ${MAX_IMAGE_MB} MB or smaller.`;
  return null;
}

/** Runs a zod schema and returns a flat { field: message } map. */
export function fieldErrors<T>(schema: z.ZodType<T>, values: unknown):
  | { ok: true; data: T }
  | { ok: false; errors: Record<string, string> } {
  const r = schema.safeParse(values);
  if (r.success) return { ok: true, data: r.data };
  const errors: Record<string, string> = {};
  for (const i of r.error.issues) {
    const k = String(i.path[0] ?? 'form');
    if (!errors[k]) errors[k] = i.message;
  }
  return { ok: false, errors };
}
