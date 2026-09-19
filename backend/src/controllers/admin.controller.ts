import type { Request, Response } from 'express';
import { Types } from 'mongoose';
import { Idea } from '../models/Idea';
import { Product } from '../models/Product';
import { CustomerQuery } from '../models/Query';
import { User } from '../models/User';
import { ApiError } from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import { serializeIdea, serializeQuery } from '../utils/serializers';
import { escapeRegex } from '../utils/strings';

/** GET /api/admin/dashboard/stats — every number is counted live from MongoDB. */
export async function dashboardStats(_req: Request, res: Response) {
  const [totalUsers, totalProducts, totalQueries, totalIdeas, pendingQueries, newIdeas, recentQueries, recentIdeas] =
    await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      CustomerQuery.countDocuments(),
      Idea.countDocuments(),
      CustomerQuery.countDocuments({ status: 'pending' }),
      Idea.countDocuments({ status: 'submitted' }),
      CustomerQuery.find().sort({ createdAt: -1 }).limit(5).lean(),
      Idea.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

  res.json({
    stats: { totalUsers, totalProducts, totalQueries, totalIdeas, pendingQueries, newIdeas },
    recentQueries: recentQueries.map((q) => serializeQuery(q)),
    recentIdeas: recentIdeas.map((i) => serializeIdea(i)),
  });
}

interface UserRow {
  _id: Types.ObjectId; name: string; email: string; createdAt: Date; queryCount: number; ideaCount: number;
}

/** Adds query/idea counts for a page of users with two grouped count queries (no N+1). */
async function withCounts(users: { _id: Types.ObjectId; name: string; email: string; createdAt: Date }[]): Promise<UserRow[]> {
  const ids = users.map((u) => u._id);
  const group = [{ $match: { user: { $in: ids } } }, { $group: { _id: '$user', n: { $sum: 1 } } }];
  const [q, i] = await Promise.all([
    CustomerQuery.aggregate<{ _id: Types.ObjectId; n: number }>(group),
    Idea.aggregate<{ _id: Types.ObjectId; n: number }>(group),
  ]);
  const qm = new Map(q.map((r) => [String(r._id), r.n]));
  const im = new Map(i.map((r) => [String(r._id), r.n]));
  return users.map((u) => ({
    _id: u._id, name: u.name, email: u.email, createdAt: u.createdAt,
    queryCount: qm.get(String(u._id)) ?? 0,
    ideaCount: im.get(String(u._id)) ?? 0,
  }));
}

const serializeUserRow = (u: UserRow) => ({
  id: String(u._id),
  name: u.name,
  email: u.email,
  joinedAt: u.createdAt,
  queryCount: u.queryCount,
  ideaCount: u.ideaCount,
});

/** GET /api/admin/users */
export async function listUsers(_req: Request, res: Response) {
  const { page, limit, search } = res.locals.query as { page: number; limit: number; search: string };
  const match: Record<string, unknown> = {};
  if (search) {
    const rx = { $regex: escapeRegex(search), $options: 'i' };
    match.$or = [{ name: rx }, { email: rx }];
  }
  const total = await User.countDocuments(match);
  const { currentPage, totalPages, skip } = paginate(page, limit, total);
  const page_ = await User.find(match).sort({ createdAt: -1 }).skip(skip).limit(limit).select('name email createdAt').lean();
  const users = await withCounts(page_);
  res.json({ items: users.map(serializeUserRow), currentPage, totalPages, total });
}

/** GET /api/admin/users/:id */
export async function getUser(req: Request, res: Response) {
  const found = await User.findById(req.params.id).select('name email createdAt').lean();
  if (!found) throw new ApiError(404, 'User not found.');
  const [user] = await withCounts([found]);

  const [recentQueries, recentIdeas] = await Promise.all([
    CustomerQuery.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean(),
    Idea.find({ user: user._id }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);

  res.json({
    user: serializeUserRow(user),
    recentQueries: recentQueries.map((q) => serializeQuery(q)),
    recentIdeas: recentIdeas.map((i) => serializeIdea(i)),
  });
}

/** DELETE /api/admin/users/:id — also removes that user's submissions. */
export async function deleteUser(req: Request, res: Response) {
  const user = await User.findById(req.params.id).select('_id');
  if (!user) throw new ApiError(404, 'User not found.');
  await user.deleteOne();
  await Promise.all([CustomerQuery.deleteMany({ user: user._id }), Idea.deleteMany({ user: user._id })]);
  res.json({ message: 'User deleted.' });
}
