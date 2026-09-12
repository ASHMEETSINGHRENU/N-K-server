"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.optionalAuthenticate = optionalAuthenticate;
const jwt_js_1 = require("../config/jwt.js");
const User_js_1 = require("../models/User.js");
async function authenticate(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Authentication required. No authorization bearer token provided.'
            });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_js_1.verifyToken)(token);
        const user = await User_js_1.User.findById(decoded.userId);
        if (!user || !user.isActive) {
            res.status(401).json({
                success: false,
                message: 'Account is invalid or deactivated.'
            });
            return;
        }
        req.user = {
            id: user._id.toString(),
            role: user.role,
            email: user.email
        };
        next();
    }
    catch (error) {
        res.status(401).json({
            success: false,
            message: 'Invalid or expired authentication token.'
        });
    }
}
async function optionalAuthenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next();
    }
    try {
        const token = authHeader.split(' ')[1];
        const decoded = (0, jwt_js_1.verifyToken)(token);
        const user = await User_js_1.User.findById(decoded.userId);
        if (user && user.isActive) {
            req.user = {
                id: user._id.toString(),
                role: user.role,
                email: user.email
            };
        }
    }
    catch {
        // Ignore invalid tokens for optional auth
    }
    next();
}
