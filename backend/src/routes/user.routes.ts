import { Router } from 'express';
import { getMe, updateMe } from '../controllers/user.controller';
import { authenticateUser } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { updateProfileSchema } from '../validators/auth.validators';

const router = Router();
router.use(authenticateUser);
router.get('/me', asyncHandler(getMe));
router.patch('/me', validate({ body: updateProfileSchema }), asyncHandler(updateMe));
export default router;
