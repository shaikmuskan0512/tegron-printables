import { z } from 'zod';
import { objectId, paginationQuery } from './common';
import { CATEGORY_ICONS } from '../models/Category';

const etsyUrl = z
  .string({ required_error: 'Etsy URL is required' })
  .trim()
  .max(500)
  .url('Please enter a valid URL')
  .refine((value) => {
    try {
      const { protocol, hostname } = new URL(value);
      return (
        protocol === 'https:' &&
        (hostname === 'etsy.com' || hostname.endsWith('.etsy.com') || hostname === 'etsy.me')
      );
    } catch {
      return false;
    }
  }, 'Please use an https Etsy link (etsy.com)');

// Values arrive as strings from multipart/form-data, so numbers are coerced.
const productFields = {
  title: z.string().trim().min(3, 'Title must be at least 3 characters').max(120),
  description: z.string().trim().min(10, 'Description must be at least 10 characters').max(2000),
  price: z.coerce
    .number({ invalid_type_error: 'Price must be a number' })
    .min(0, 'Price cannot be negative')
    .max(10_000, 'Price looks too high')
    .transform((n) => Math.round(n * 100) / 100),
  category: objectId,
  etsyUrl,
};

export const createProductSchema = z.object(productFields).strict();
export const updateProductSchema = z.object(productFields).partial().strict();

export const productListQuery = paginationQuery.extend({
  category: z.string().trim().max(80).optional().default(''),
});

export const categorySchema = z
  .object({
    name: z.string().trim().min(2, 'Name must be at least 2 characters').max(40),
    icon: z.enum(CATEGORY_ICONS).optional(),
  })
  .strict();

export const updateCategorySchema = categorySchema.partial().strict();
