import cors from 'cors';
import express from 'express';
import mongoSanitize from 'express-mongo-sanitize';
import helmet from 'helmet';
import { env } from './config/env';
import { errorHandler, notFound } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimit';
import routes from './routes';

export function createApp() {
  const app = express();

  app.disable('x-powered-by');
  if (env.isProd) app.set('trust proxy', 1); // correct client IPs for rate limiting behind a proxy

  app.use(helmet());
  app.use(
    cors({
      origin(origin, cb) {
        // Allow same-origin / server-to-server requests (no Origin header) and configured clients
        if (!origin || env.clientOrigins.includes(origin)) return cb(null, true);
        return cb(null, false);
      },
      methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      maxAge: 600,
    }),
  );
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));
  // Strips $ and . operators from input to block NoSQL injection
  app.use(mongoSanitize());

  app.use('/api', apiLimiter, routes);

  app.use(notFound);
  app.use(errorHandler);
  return app;
}
