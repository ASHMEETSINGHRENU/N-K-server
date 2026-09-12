"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ENV = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// Load .env from monorepo root or local
dotenv_1.default.config({ path: path_1.default.resolve(process.cwd(), '../../.env') });
dotenv_1.default.config();
exports.ENV = {
    PORT: parseInt(process.env.PORT || '5000', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    API_PREFIX: process.env.API_PREFIX || '/api/v1',
    MONGODB_URI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nestandkey',
    JWT_SECRET: process.env.JWT_SECRET || 'nestandkey_super_secret_jwt_key_2026_dubai_luxury_real_estate',
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || 'nestandkey_refresh_secret_jwt_key_2026_ultra_prime',
    JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
    BROKER_URL: process.env.BROKER_URL || 'http://localhost:5174',
    ADMIN_URL: process.env.ADMIN_URL || 'http://localhost:5175'
};
