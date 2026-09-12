import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import routesV1 from './routes/v1/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { ENV } from './config/env.js';

export function createApp(): Express {
  const app = express();

  // Security headers
  app.use(helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' }
  }));

  // CORS configuration
  const envOrigins = (process.env.ALLOWED_ORIGINS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  const allowedOrigins = [
    ENV.CLIENT_URL,
    ENV.BROKER_URL,
    ENV.ADMIN_URL,
    ...envOrigins,
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:3000'
  ];

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(null, true); // Dev-friendly fallback
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    })
  );

  // Request body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // HTTP request logging
  if (ENV.NODE_ENV !== 'test') {
    app.use(morgan('dev'));
  }

  // Root welcome endpoint
  app.get('/', (req: Request, res: Response) => {
    res.json({
  "success": true,
  "service": "Nestandkey Luxury Dubai Real Estate API",
  "status": "online",
  "version": "1.0.0",
  "endpoints": {
    "health": "/api/health",
    "properties": "/api/v1/properties"
  }
  });
  });

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      service: 'Nestandkey Luxury Dubai Real Estate API',
      timestamp: new Date().toISOString(),
      environment: ENV.NODE_ENV
    });
  });

  // Mount API v1
  app.use(ENV.API_PREFIX, routesV1);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });

  // Global error handler
  app.use(errorHandler);

  return app;
}
