"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authLimiter = exports.leadCaptureLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Standard rate limiter for public inquiry form submissions
exports.leadCaptureLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // Max 20 inquiries per IP in 15 minutes
    message: {
        success: false,
        message: 'Too many consultation inquiries submitted from this IP. Please wait a few moments or contact our private desk directly.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
// Auth endpoints rate limiter (login / register)
exports.authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: {
        success: false,
        message: 'Too many authentication attempts. Please try again in 15 minutes.'
    },
    standardHeaders: true,
    legacyHeaders: false
});
