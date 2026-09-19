import type { Request, Response } from 'express';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { serializeUser } from '../utils/serializers';

export async function getMe(req: Request, res: Response) {
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'Account not found.');
  res.json({ user: serializeUser(user) });
}

export async function updateMe(req: Request, res: Response) {
  const { name } = req.body as { name: string };
  const user = await User.findById(req.userId);
  if (!user) throw new ApiError(404, 'Account not found.');
  user.name = name;
  await user.save();
  res.json({ user: serializeUser(user) });
}
