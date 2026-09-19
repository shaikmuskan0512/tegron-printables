import type { Request, Response } from 'express';
import type { FilterQuery } from 'mongoose';
import { Category } from '../models/Category';
import { Product, type ProductAttrs } from '../models/Product';
import { deleteProductImage, uploadProductImage } from '../services/cloudinary.service';
import { ApiError } from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import { serializeProduct } from '../utils/serializers';
import { escapeRegex, isObjectId, uniqueSlug } from '../utils/strings';

const CATEGORY_FIELDS = 'name slug icon createdAt';

/** GET /api/products?search=&category=&page=&limit= */
export async function listProducts(_req: Request, res: Response) {
  const { page, limit, search, category } = res.locals.query as {
    page: number; limit: number; search: string; category: string;
  };

  const filter: FilterQuery<ProductAttrs> = {};

  if (category && category !== 'all') {
    const cat = await Category.findOne(
      isObjectId(category) ? { _id: category } : { slug: category.toLowerCase() },
    ).select('_id').lean();
    if (!cat) {
      res.json({ products: [], currentPage: 1, totalPages: 1, totalProducts: 0 });
      return;
    }
    filter.category = cat._id;
  }

  if (search) filter.title = { $regex: escapeRegex(search), $options: 'i' };

  const totalProducts = await Product.countDocuments(filter);
  const { currentPage, totalPages, skip } = paginate(page, limit, totalProducts);

  const products = await Product.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip(skip)
    .limit(limit)
    .select('-cloudinaryPublicId -__v')
    .populate('category', CATEGORY_FIELDS)
    .lean();

  res.json({ products: products.map(serializeProduct), currentPage, totalPages, totalProducts });
}

/** GET /api/products/:id — accepts an id or a slug */
export async function getProduct(req: Request, res: Response) {
  const { id } = req.params;
  const product = await Product.findOne(isObjectId(id) ? { _id: id } : { slug: id.toLowerCase() })
    .select('-cloudinaryPublicId -__v')
    .populate('category', CATEGORY_FIELDS)
    .lean();
  if (!product) throw new ApiError(404, 'This printable could not be found.');
  res.json({ product: serializeProduct(product) });
}

async function assertCategory(id: string) {
  if (!(await Category.exists({ _id: id }))) {
    throw new ApiError(400, 'Please choose a valid category.', { category: 'Please choose a valid category.' });
  }
}

/** POST /api/admin/products (multipart: image + fields) */
export async function createProduct(req: Request, res: Response) {
  if (!req.file) throw new ApiError(400, 'Please add a product image.', { image: 'Please add a product image.' });
  const body = req.body as { title: string; description: string; price: number; category: string; etsyUrl: string };
  await assertCategory(body.category);

  const image = await uploadProductImage(req.file.buffer);
  try {
    const product = await Product.create({
      ...body,
      slug: await uniqueSlug(Product, body.title),
      imageUrl: image.url,
      cloudinaryPublicId: image.publicId,
    });
    await product.populate('category', CATEGORY_FIELDS);
    res.status(201).json({ product: serializeProduct(product) });
  } catch (err) {
    await deleteProductImage(image.publicId); // don't leave orphaned uploads behind
    throw err;
  }
}

/** PATCH /api/admin/products/:id (multipart; image optional) */
export async function updateProduct(req: Request, res: Response) {
  const product = await Product.findById(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');

  const body = req.body as Partial<{ title: string; description: string; price: number; category: string; etsyUrl: string }>;
  if (body.category) await assertCategory(body.category);

  if (body.title !== undefined && body.title !== product.title) {
    product.slug = await uniqueSlug(Product, body.title, String(product._id));
  }
  if (body.title !== undefined) product.title = body.title;
  if (body.description !== undefined) product.description = body.description;
  if (body.price !== undefined) product.price = body.price;
  if (body.etsyUrl !== undefined) product.etsyUrl = body.etsyUrl;
  if (body.category !== undefined) product.set('category', body.category);

  const previousPublicId = product.cloudinaryPublicId;
  let newPublicId: string | null = null;
  if (req.file) {
    const image = await uploadProductImage(req.file.buffer);
    newPublicId = image.publicId;
    product.imageUrl = image.url;
    product.cloudinaryPublicId = image.publicId;
  }

  try {
    await product.save();
  } catch (err) {
    if (newPublicId) await deleteProductImage(newPublicId);
    throw err;
  }

  // Only remove the old image once the new one is safely saved
  if (newPublicId && previousPublicId) await deleteProductImage(previousPublicId);

  await product.populate('category', CATEGORY_FIELDS);
  res.json({ product: serializeProduct(product) });
}

/** DELETE /api/admin/products/:id */
export async function deleteProduct(req: Request, res: Response) {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) throw new ApiError(404, 'Product not found.');
  await deleteProductImage(product.cloudinaryPublicId);
  res.json({ message: 'Product deleted.' });
}
