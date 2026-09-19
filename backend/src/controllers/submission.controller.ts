import type { Request, Response } from 'express';
import type { FilterQuery } from 'mongoose';
import { Idea, type IdeaAttrs } from '../models/Idea';
import { CustomerQuery, type QueryAttrs } from '../models/Query';
import { ApiError } from '../utils/ApiError';
import { paginate } from '../utils/pagination';
import { serializeIdea, serializeQuery } from '../utils/serializers';
import { escapeRegex } from '../utils/strings';

/* ----------------------------- Queries ----------------------------- */

export async function createQuery(req: Request, res: Response) {
  const query = await CustomerQuery.create({ ...req.body, user: req.userId, status: 'pending' });
  res.status(201).json({ query: serializeQuery(query) });
}

/** Ownership comes only from the verified JWT (req.userId). */
export async function myQueries(req: Request, res: Response) {
  const queries = await CustomerQuery.find({ user: req.userId }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ queries: queries.map((q) => serializeQuery(q)) });
}

export async function adminListQueries(_req: Request, res: Response) {
  const { page, limit, search, status } = res.locals.query as {
    page: number; limit: number; search: string; status?: string;
  };
  const filter: FilterQuery<QueryAttrs> = {};
  if (status) filter.status = status;
  if (search) {
    const rx = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: rx }, { email: rx }, { query: rx }];
  }
  const total = await CustomerQuery.countDocuments(filter);
  const { currentPage, totalPages, skip } = paginate(page, limit, total);
  const items = await CustomerQuery.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .lean();
  res.json({
    items: items.map((q) => serializeQuery(q, { includeUser: true })),
    currentPage,
    totalPages,
    total,
  });
}

export async function adminSetQueryStatus(req: Request, res: Response) {
  const query = await CustomerQuery.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate('user', 'name email');
  if (!query) throw new ApiError(404, 'Query not found.');
  res.json({ item: serializeQuery(query, { includeUser: true }) });
}

export async function adminDeleteQuery(req: Request, res: Response) {
  const deleted = await CustomerQuery.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Query not found.');
  res.json({ message: 'Query deleted.' });
}

/* ------------------------------ Ideas ------------------------------ */

export async function createIdea(req: Request, res: Response) {
  const idea = await Idea.create({ ...req.body, user: req.userId, status: 'submitted' });
  res.status(201).json({ idea: serializeIdea(idea) });
}

export async function myIdeas(req: Request, res: Response) {
  const ideas = await Idea.find({ user: req.userId }).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ ideas: ideas.map((i) => serializeIdea(i)) });
}

export async function adminListIdeas(_req: Request, res: Response) {
  const { page, limit, search, status } = res.locals.query as {
    page: number; limit: number; search: string; status?: string;
  };
  const filter: FilterQuery<IdeaAttrs> = {};
  if (status) filter.status = status;
  if (search) {
    const rx = { $regex: escapeRegex(search), $options: 'i' };
    filter.$or = [{ name: rx }, { email: rx }, { productIdea: rx }, { description: rx }];
  }
  const total = await Idea.countDocuments(filter);
  const { currentPage, totalPages, skip } = paginate(page, limit, total);
  const items = await Idea.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('user', 'name email')
    .lean();
  res.json({
    items: items.map((i) => serializeIdea(i, { includeUser: true })),
    currentPage,
    totalPages,
    total,
  });
}

export async function adminSetIdeaStatus(req: Request, res: Response) {
  const idea = await Idea.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true, runValidators: true },
  ).populate('user', 'name email');
  if (!idea) throw new ApiError(404, 'Idea not found.');
  res.json({ item: serializeIdea(idea, { includeUser: true }) });
}

export async function adminDeleteIdea(req: Request, res: Response) {
  const deleted = await Idea.findByIdAndDelete(req.params.id);
  if (!deleted) throw new ApiError(404, 'Idea not found.');
  res.json({ message: 'Idea deleted.' });
}
