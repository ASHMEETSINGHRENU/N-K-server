"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDatabase = connectDatabase;
const mongoose_1 = __importDefault(require("mongoose"));
const env_js_1 = require("./env.js");
async function connectDatabase() {
    try {
        mongoose_1.default.set('strictQuery', false);
        const conn = await mongoose_1.default.connect(env_js_1.ENV.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
        });
        console.log(`[Database] Connected to MongoDB: ${conn.connection.host}/${conn.connection.name}`);
        return conn;
    }
    catch (error) {
        console.error(`[Database Error] Failed to connect to MongoDB: ${error.message}`);
        console.warn(`[Database Warning] Operating in resilient fallback mode if DB is unavailable.`);
        throw error;
    }
}
