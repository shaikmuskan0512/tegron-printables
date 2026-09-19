import type { Request, Response } from 'express';
import { Category } from '../models/Category';
import { Product } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { serializeCategory } from '../utils/serializers';
import { escapeRegex, uniqueSlug } from '../utils/strings';

/** GET /api/categories */
export async function listCategories(_req: Request, res: Response) {
  const categories = await Category.find().sort({ createdAt: 1 }).lean();
  res.set('Cache-Control', 'public, max-age=60');
  res.json({ categories: categories.map(serializeCategory) });
}

/** GET /api/admin/categories — includes product counts */
export async function adminListCategories(_req: Request, res: Response) {
  const [categories, counts] = await Promise.all([
    Category.find().sort({ createdAt: 1 }).lean(),
    Product.aggregate<{ _id: unknown; count: number }>([{ $group: { _id: '$category', count: { $sum: 1 } } }]),
  ]);
  const byId = new Map(counts.map((c) => [String(c._id), c.count]));
  res.json({
    categories: categories.map((c) => ({ ...serializeCategory(c), productCount: byId.get(String(c._id)) ?? 0 })),
  });
}

async function assertNameFree(name: string, excludeId?: string) {
  const filter: Record<string, unknown> = { name: { $regex: `^${escapeRegex(name)}$`, $options: 'i' } };
  if (excludeId) filter._id = { $ne: excludeId };
  if (await Category.exists(filter)) {
    throw new ApiError(409, 'A category with this name already exists.', { name: 'This name is already used.' });
  }
}

export async function createCategory(req: Request, res: Response) {
  const { name, icon } = req.body as { name: string; icon?: string };
  await assertNameFree(name);
  const category = await Category.create({ name, icon, slug: await uniqueSlug(Category, name) });
  res.status(201).json({ category: serializeCategory(category) });
}

export async function updateCategory(req: Request, res: Response) {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');
  const { name, icon } = req.body as { name?: string; icon?: string };

  if (name !== undefined && name !== category.name) {
    await assertNameFree(name, String(category._id));
    category.name = name;
    category.slug = await uniqueSlug(Category, name, String(category._id));
  }
  if (icon !== undefined) category.set('icon', icon);
  await category.save();
  res.json({ category: serializeCategory(category) });
}

export async function deleteCategory(req: Request, res: Response) {
  const category = await Category.findById(req.params.id);
  if (!category) throw new ApiError(404, 'Category not found.');

  const inUse = await Product.countDocuments({ category: category._id });
  if (inUse > 0) {
    throw new ApiError(
      409,
      `"${category.name}" still has ${inUse} product${inUse === 1 ? '' : 's'}. Move or delete them first.`,
    );
  }
  await category.deleteOne();
  res.json({ message: 'Category deleted.' });
}
