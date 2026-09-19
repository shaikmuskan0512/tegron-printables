import { Router } from 'express';
import * as auth from '../controllers/auth.controller';
import { authenticateUser } from '../middleware/auth';
import { authLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { loginSchema, signupSchema } from '../validators/auth.validators';

const router = Router();
router.post('/signup', authLimiter, validate({ body: signupSchema }), asyncHandler(auth.signup));
router.post('/login', authLimiter, validate({ body: loginSchema }), asyncHandler(auth.login));
router.get('/me', authenticateUser, asyncHandler(auth.me));
export default router;
