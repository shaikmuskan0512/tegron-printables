import { z } from 'zod';
import { emailField, nameField } from './common';

export const passwordField = z
  .string({ required_error: 'Password is required' })
  .min(8, 'Password must be at least 8 characters')
  .max(72, 'Password must be 72 characters or fewer')
  .regex(/[A-Za-z]/, 'Password must include a letter')
  .regex(/\d/, 'Password must include a number');

export const signupSchema = z.object({ name: nameField, email: emailField, password: passwordField }).strict();

export const loginSchema = z
  .object({
    email: emailField,
    password: z.string({ required_error: 'Password is required' }).min(1, 'Password is required').max(72),
  })
  .strict();

export const updateProfileSchema = z.object({ name: nameField }).strict();
