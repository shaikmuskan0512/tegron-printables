import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiError';

export const notFound: RequestHandler = (_req, res) => {
  res.status(404).json({ message: 'We could not find what you were looking for.' });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({ message: err.message, errors: err.details });
    return;
  }

  if (err instanceof ZodError) {
    const errors: Record<string, string> = {};
    for (const issue of err.issues) {
      const key = issue.path.join('.') || 'form';
      if (!errors[key]) errors[key] = issue.message;
    }
    res.status(400).json({ message: err.issues[0]?.message ?? 'Please check the form.', errors });
    return;
  }

  if (err instanceof multer.MulterError) {
    const message =
      err.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : 'The image could not be uploaded.';
    res.status(400).json({ message });
    return;
  }

  if (err?.type === 'entity.parse.failed') {
    res.status(400).json({ message: 'The request body is not valid JSON.' });
    return;
  }
  if (err?.type === 'entity.too.large') {
    res.status(413).json({ message: 'That request is too large.' });
    return;
  }

  if (err?.code === 11000) {
    res.status(409).json({ message: 'That value is already in use.' });
    return;
  }

  if (err instanceof mongoose.Error.CastError) {
    res.status(400).json({ message: 'Invalid id.' });
    return;
  }

  // Unknown error: log it on the server, never send details to the client.
  console.error('[unhandled]', err);
  res.status(500).json({ message: 'Something went wrong. Please try again.' });
};
