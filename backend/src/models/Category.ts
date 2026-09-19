import { Schema, model, type InferSchemaType } from 'mongoose';

/** Icon names the frontend knows how to render (Lucide icons). */
export const CATEGORY_ICONS = [
  'sun', 'book-open', 'palette', 'scissors', 'puzzle', 'star',
  'heart', 'pencil', 'shapes', 'sparkles', 'baby', 'calculator',
] as const;
export type CategoryIcon = (typeof CATEGORY_ICONS)[number];

const categorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true, maxlength: 40 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    icon: { type: String, enum: CATEGORY_ICONS, default: 'sparkles' },
  },
  { timestamps: true },
);

export type CategoryAttrs = InferSchemaType<typeof categorySchema>;
export const Category = model('Category', categorySchema);
