"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const index_js_1 = __importDefault(require("./routes/v1/index.js"));
const errorHandler_js_1 = require("./middleware/errorHandler.js");
const env_js_1 = require("./config/env.js");
function createApp() {
    const app = (0, express_1.default)();
    // Security headers
    app.use((0, helmet_1.default)({
        crossOriginResourcePolicy: { policy: 'cross-origin' }
    }));
    // CORS configuration
    const envOrigins = (process.env.ALLOWED_ORIGINS || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    const allowedOrigins = [
        env_js_1.ENV.CLIENT_URL,
        env_js_1.ENV.BROKER_URL,
        env_js_1.ENV.ADMIN_URL,
        ...envOrigins,
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175',
        'http://localhost:3000'
    ];
    app.use((0, cors_1.default)({
        origin: (origin, callback) => {
            // Allow requests with no origin (like mobile apps, curl, or server-to-server)
            if (!origin || allowedOrigins.includes(origin)) {
                callback(null, true);
            }
            else {
                callback(null, true); // Dev-friendly fallback
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
    }));
    // Request body parsing
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
    // HTTP request logging
    if (env_js_1.ENV.NODE_ENV !== 'test') {
        app.use((0, morgan_1.default)('dev'));
    }
    // Root welcome endpoint
    app.get('/', (req, res) => {
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
    app.get('/api/health', (req, res) => {
        res.json({
            status: 'healthy',
            service: 'Nestandkey Luxury Dubai Real Estate API',
            timestamp: new Date().toISOString(),
            environment: env_js_1.ENV.NODE_ENV
        });
    });
    // Mount API v1
    app.use(env_js_1.ENV.API_PREFIX, index_js_1.default);
    // 404 handler
    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: `Endpoint not found: ${req.method} ${req.originalUrl}`
        });
    });
    // Global error handler
    app.use(errorHandler_js_1.errorHandler);
    return app;
}
