import { Router } from 'express';
import { listCategories } from '../controllers/category.controller';
import { getProduct, listProducts } from '../controllers/product.controller';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { productListQuery } from '../validators/catalog.validators';
import { z } from 'zod';

export const productRouter = Router();
productRouter.get('/', validate({ query: productListQuery }), asyncHandler(listProducts));
productRouter.get(
  '/:id',
  validate({ params: z.object({ id: z.string().trim().min(1).max(100) }) }),
  asyncHandler(getProduct),
);

export const categoryRouter = Router();
categoryRouter.get('/', asyncHandler(listCategories));
