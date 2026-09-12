import { createApp } from './app.js';
import { connectDatabase } from './config/database.js';
import { ENV } from './config/env.js';

async function startServer() {
  try {
    await connectDatabase();

    const app = createApp();
    const server = app.listen(ENV.PORT, () => {
      console.log(`
===========================================================
  NESTANDKEY — LUXURY DUBAI REAL ESTATE ECOSYSTEM
===========================================================
  API Server Status: RUNNING
  Environment:       ${ENV.NODE_ENV}
  Port:              ${ENV.PORT}
  API Endpoint:      http://localhost:${ENV.PORT}${ENV.API_PREFIX}
  Health Check:      http://localhost:${ENV.PORT}/api/health
===========================================================
      `);
    });

    // Graceful shutdown handling
    process.on('SIGTERM', () => {
      console.log('SIGTERM signal received. Closing HTTP server...');
      server.close(() => {
        console.log('HTTP server closed.');
        process.exit(0);
      });
    });
  } catch (err) {
    console.error('Failed to start Nestandkey API Server:', err);
    process.exit(1);
  }
}

startServer();
