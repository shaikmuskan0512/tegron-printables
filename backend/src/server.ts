import { env } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/db';
import { createApp } from './app';

async function main() {
  await connectDatabase();
  const app = createApp();
  const server = app.listen(env.PORT, () => {
    console.log(`✓ Tegron Printables API listening on port ${env.PORT}`);
    if (!env.cloudinaryEnabled) {
      console.warn('! Cloudinary is not configured — product image uploads will be unavailable.');
    }
  });

  const shutdown = (signal: string) => {
    console.log(`${signal} received, shutting down…`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
  };
  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

main().catch((err) => {
  console.error('Failed to start server:', err instanceof Error ? err.message : err);
  process.exit(1);
});
