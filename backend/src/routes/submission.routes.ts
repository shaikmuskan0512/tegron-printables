import { Router } from 'express';
import * as s from '../controllers/submission.controller';
import { authenticateUser } from '../middleware/auth';
import { submissionLimiter } from '../middleware/rateLimit';
import { validate } from '../middleware/validate';
import { asyncHandler } from '../utils/asyncHandler';
import { createIdeaSchema, createQuerySchema } from '../validators/submission.validators';

export const queryRouter = Router();
queryRouter.use(authenticateUser);
queryRouter.post('/', submissionLimiter, validate({ body: createQuerySchema }), asyncHandler(s.createQuery));
queryRouter.get('/my', asyncHandler(s.myQueries));

export const ideaRouter = Router();
ideaRouter.use(authenticateUser);
ideaRouter.post('/', submissionLimiter, validate({ body: createIdeaSchema }), asyncHandler(s.createIdea));
ideaRouter.get('/my', asyncHandler(s.myIdeas));
