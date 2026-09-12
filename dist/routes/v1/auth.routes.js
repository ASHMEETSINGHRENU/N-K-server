"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_js_1 = require("../../controllers/auth/auth.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const rateLimiter_js_1 = require("../../middleware/rateLimiter.js");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_js_1.authLimiter, auth_controller_js_1.handleRegister);
router.post('/login', rateLimiter_js_1.authLimiter, auth_controller_js_1.handleLogin);
router.get('/me', authenticate_js_1.authenticate, auth_controller_js_1.handleGetMe);
// Admin User Management
router.get('/users', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), auth_controller_js_1.handleGetUsers);
router.patch('/users/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), auth_controller_js_1.handleUpdateUserStatus);
exports.default = router;
