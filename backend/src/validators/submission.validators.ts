import { z } from 'zod';
import { emailField, nameField, paginationQuery } from './common';
import { QUERY_STATUSES } from '../models/Query';
import { IDEA_STATUSES } from '../models/Idea';

export const createQuerySchema = z
  .object({
    name: nameField,
    email: emailField,
    query: z
      .string({ required_error: 'Please write your question' })
      .trim()
      .min(10, 'Your question should be at least 10 characters')
      .max(2000, 'Your question should be 2000 characters or fewer'),
  })
  .strict();

export const createIdeaSchema = z
  .object({
    name: nameField,
    email: emailField,
    productIdea: z
      .string({ required_error: 'Please name your idea' })
      .trim()
      .min(3, 'Idea title should be at least 3 characters')
      .max(120, 'Idea title should be 120 characters or fewer'),
    description: z
      .string({ required_error: 'Please describe your idea' })
      .trim()
      .min(10, 'Description should be at least 10 characters')
      .max(2000, 'Description should be 2000 characters or fewer'),
  })
  .strict();

export const queryStatusSchema = z.object({ status: z.enum(QUERY_STATUSES) }).strict();
export const ideaStatusSchema = z.object({ status: z.enum(IDEA_STATUSES) }).strict();

export const adminQueryListSchema = paginationQuery.extend({
  status: z.enum(QUERY_STATUSES).optional(),
});
export const adminIdeaListSchema = paginationQuery.extend({
  status: z.enum(IDEA_STATUSES).optional(),
});
