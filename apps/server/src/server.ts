import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { healthRouter } from './routes/healthRoutes.js';
import { slackRouter } from './routes/slackRoutes.js';
import { contextRouter } from './routes/contextRoutes.js';
import { demoRouter } from './routes/demoRoutes.js';

export function createServer() {
  const app = express();

  // CORS - allow browser extensions, local dev ports (3000, 5173, chrome-extension://)
  app.use(
    cors({
      origin: '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
  });

  // Mount API routers
  app.use('/', healthRouter);
  app.use('/', slackRouter);
  app.use('/api/context', contextRouter);
  app.use('/api/demo', demoRouter);

  // Global error handler
  app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('[Server Error]', err);
    res.status(500).json({
      error: 'Internal Server Error',
      message: err.message || 'An unexpected error occurred',
    });
  });

  return app;
}
