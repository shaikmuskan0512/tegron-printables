import { Router } from 'express';
import * as admin from '../controllers/admin.controller';
import { adminMe } from '../controllers/auth.controller';
import * as cat from '../controllers/category.controller';
import * as prod from '../controllers/product.controller';
import * as sub from '../controllers/submission.controller';
import { authenticateAdmin } from '../middleware/auth';
import { productImageUpload } from '../middleware/upload';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import {
  categorySchema, createProductSchema, updateCategorySchema, updateProductSchema,
} from '../validators/catalog.validators';
import { idParams, paginationQuery } from '../validators/common';
import {
  adminIdeaListSchema, adminQueryListSchema, ideaStatusSchema, queryStatusSchema,
} from '../validators/submission.validators';

const router = Router();

// There is no admin login endpoint here: admins sign in through POST /api/auth/login
// (the backend detects the role). Everything below requires an admin-audience token.
router.use(authenticateAdmin);
router.get('/auth/me', asyncHandler(adminMe));
router.get('/dashboard/stats', asyncHandler(admin.dashboardStats));

// Users
router.get('/users', validate({ query: paginationQuery }), asyncHandler(admin.listUsers));
router.get('/users/:id', validate({ params: idParams }), asyncHandler(admin.getUser));
router.delete('/users/:id', validate({ params: idParams }), asyncHandler(admin.deleteUser));

// Products (multipart: the upload middleware runs before body validation)
router.post('/products', productImageUpload, validate({ body: createProductSchema }), asyncHandler(prod.createProduct));
router.patch(
  '/products/:id',
  productImageUpload,
  validate({ params: idParams, body: updateProductSchema }),
  asyncHandler(prod.updateProduct),
);
router.delete('/products/:id', validate({ params: idParams }), asyncHandler(prod.deleteProduct));

// Categories
router.get('/categories', asyncHandler(cat.adminListCategories));
router.post('/categories', validate({ body: categorySchema }), asyncHandler(cat.createCategory));
router.patch('/categories/:id', validate({ params: idParams, body: updateCategorySchema }), asyncHandler(cat.updateCategory));
router.delete('/categories/:id', validate({ params: idParams }), asyncHandler(cat.deleteCategory));

// Queries
router.get('/queries', validate({ query: adminQueryListSchema }), asyncHandler(sub.adminListQueries));
router.patch('/queries/:id/status', validate({ params: idParams, body: queryStatusSchema }), asyncHandler(sub.adminSetQueryStatus));
router.delete('/queries/:id', validate({ params: idParams }), asyncHandler(sub.adminDeleteQuery));

// Ideas
router.get('/ideas', validate({ query: adminIdeaListSchema }), asyncHandler(sub.adminListIdeas));
router.patch('/ideas/:id/status', validate({ params: idParams, body: ideaStatusSchema }), asyncHandler(sub.adminSetIdeaStatus));
router.delete('/ideas/:id', validate({ params: idParams }), asyncHandler(sub.adminDeleteIdea));

export default router;