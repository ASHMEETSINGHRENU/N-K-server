"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = require("./app.js");
const database_js_1 = require("./config/database.js");
const env_js_1 = require("./config/env.js");
async function startServer() {
    try {
        await (0, database_js_1.connectDatabase)();
        const app = (0, app_js_1.createApp)();
        const server = app.listen(env_js_1.ENV.PORT, () => {
            console.log(`
===========================================================
  CRESTSHORE — LUXURY DUBAI REAL ESTATE ECOSYSTEM
===========================================================
  API Server Status: RUNNING
  Environment:       ${env_js_1.ENV.NODE_ENV}
  Port:              ${env_js_1.ENV.PORT}
  API Endpoint:      http://localhost:${env_js_1.ENV.PORT}${env_js_1.ENV.API_PREFIX}
  Health Check:      http://localhost:${env_js_1.ENV.PORT}/api/health
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
    }
    catch (err) {
        console.error('Failed to start Crestshore API Server:', err);
        process.exit(1);
    }
}
startServer();
