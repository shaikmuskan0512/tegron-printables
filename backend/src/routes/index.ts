import { Router } from 'express';
import adminRoutes from './admin.routes';
import authRoutes from './auth.routes';
import { categoryRouter, productRouter } from './catalog.routes';
import { ideaRouter, queryRouter } from './submission.routes';
import userRoutes from './user.routes';

const router = Router();
router.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/products', productRouter);
router.use('/categories', categoryRouter);
router.use('/queries', queryRouter);
router.use('/ideas', ideaRouter);
router.use('/admin', adminRoutes);
export default router;
