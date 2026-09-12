"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = generateToken;
exports.generateRefreshToken = generateRefreshToken;
exports.verifyToken = verifyToken;
exports.verifyRefreshToken = verifyRefreshToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_js_1 = require("./env.js");
function generateToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_SECRET, {
        expiresIn: env_js_1.ENV.JWT_EXPIRES_IN,
    });
}
function generateRefreshToken(payload) {
    return jsonwebtoken_1.default.sign(payload, env_js_1.ENV.JWT_REFRESH_SECRET, {
        expiresIn: env_js_1.ENV.JWT_REFRESH_EXPIRES_IN,
    });
}
function verifyToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_SECRET);
}
function verifyRefreshToken(token) {
    return jsonwebtoken_1.default.verify(token, env_js_1.ENV.JWT_REFRESH_SECRET);
}
