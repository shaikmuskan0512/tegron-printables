import { Schema, model, type InferSchemaType } from 'mongoose';

const productSchema = new Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    price: { type: Number, required: true, min: 0 },
    // Cloudinary URL only — image binaries never live in MongoDB.
    imageUrl: { type: String, default: '' },
    cloudinaryPublicId: { type: String, default: '' },
    etsyUrl: { type: String, required: true, trim: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
  },
  { timestamps: true },
);

productSchema.index({ category: 1, createdAt: -1 });
productSchema.index({ createdAt: -1 });
productSchema.index({ title: 1 });

export type ProductAttrs = InferSchemaType<typeof productSchema>;
export const Product = model('Product', productSchema);
