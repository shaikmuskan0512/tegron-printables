import type { Request } from 'express';
import { AdminUser } from '../models/AdminUser';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { asyncHandler } from '../utils/asyncHandler';
import { verifyToken } from '../utils/jwt';

function bearer(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

/** Requires a valid *user* token. The user id always comes from the verified JWT. */
export const authenticateUser = asyncHandler(async (req, _res, next) => {
  const token = bearer(req);
  if (!token) throw new ApiError(401, 'Please log in to continue.');

  let userId: string;
  try {
    userId = verifyToken(token, 'user');
  } catch {
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }

  if (!(await User.exists({ _id: userId }))) {
    throw new ApiError(401, 'Please log in to continue.');
  }
  req.userId = userId;
  next();
});

/** Requires a valid *admin* token. User tokens are rejected (different audience). */
export const authenticateAdmin = asyncHandler(async (req, _res, next) => {
  const token = bearer(req);
  if (!token) throw new ApiError(401, 'Admin login required.');

  let adminId: string;
  try {
    adminId = verifyToken(token, 'admin');
  } catch {
    throw new ApiError(401, 'Admin session expired. Please log in again.');
  }

  if (!(await AdminUser.exists({ _id: adminId }))) {
    throw new ApiError(403, 'You do not have access to this area.');
  }
  req.adminId = adminId;
  next();
});

// Alias matching the naming in the project brief
export const adminAuthMiddleware = authenticateAdmin;
