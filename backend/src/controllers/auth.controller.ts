import bcrypt from 'bcryptjs';
import type { Request, Response } from 'express';
import { AdminUser } from '../models/AdminUser';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { signToken } from '../utils/jwt';
import { serializeUser } from '../utils/serializers';

const SALT_ROUNDS = 12;
// Compared against when an email does not exist so response time stays similar.
const DUMMY_HASH = bcrypt.hashSync('tegron-timing-guard', SALT_ROUNDS);
const INVALID = 'Invalid email or password.';
const EMAIL_TAKEN = 'An account with this email already exists.';

const serializeAdmin = (a: { name: string; email: string }) => ({ name: a.name, email: a.email });

export async function signup(req: Request, res: Response) {
  const { name, email, password } = req.body as { name: string; email: string; password: string };

  // Admin emails are reserved. Customers and admins share one login form, so the
  // same email must never be registrable as a customer account as well.
  const [userExists, adminExists] = await Promise.all([User.exists({ email }), AdminUser.exists({ email })]);
  if (userExists || adminExists) {
    throw new ApiError(409, EMAIL_TAKEN, { email: EMAIL_TAKEN });
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const user = await User.create({ name, email, passwordHash });

  res.status(201).json({ token: signToken(String(user._id), 'user'), user: serializeUser(user) });
}

/**
 * Single login endpoint for customers and admins.
 *
 * The backend decides who the credentials belong to: it looks the email up in the
 * AdminUser and User collections and verifies the password against whichever
 * account it matches. The role is never taken from the request.
 *
 *   admin    -> { role: 'admin', token (audience "admin"), admin }
 *   customer -> { role: 'user',  token (audience "user"),  user  }
 *
 * If the same email exists in both collections, the password decides which account
 * it is, so a customer can never obtain an admin token with their own password.
 */
export async function login(req: Request, res: Response) {
  const { email, password } = req.body as { email: string; password: string };

  const [admin, user] = await Promise.all([
    AdminUser.findOne({ email }).select('+passwordHash'),
    User.findOne({ email }).select('+passwordHash'),
  ]);

  if (admin && (await bcrypt.compare(password, admin.passwordHash))) {
    res.json({ role: 'admin', token: signToken(String(admin._id), 'admin'), admin: serializeAdmin(admin) });
    return;
  }

  if (user && (await bcrypt.compare(password, user.passwordHash))) {
    res.json({ role: 'user', token: signToken(String(user._id), 'user'), user: serializeUser(user) });
    return;
  }

  // Unknown email: still burn one bcrypt comparison so timing does not reveal which emails exist.
  if (!admin && !user) await bcrypt.compare(password, DUMMY_HASH);
  throw new ApiError(401, INVALID);
}

export async function me(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(401, 'Please log in to continue.');
  res.json({ user: serializeUser(user) });
}

export async function adminMe(req: Request, res: Response) {
  const admin = await AdminUser.findById(req.adminId);
  if (!admin) throw new ApiError(401, 'Admin login required.');
  res.json({ admin: serializeAdmin(admin) });
}

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);