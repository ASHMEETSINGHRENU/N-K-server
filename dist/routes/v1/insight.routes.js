"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const insight_controller_js_1 = require("../../controllers/insights/insight.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', insight_controller_js_1.handleGetInsights);
router.get('/:slug', insight_controller_js_1.handleGetInsightBySlug);
// Admin CMS routes
router.post('/', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), insight_controller_js_1.handleCreateInsight);
router.put('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), insight_controller_js_1.handleUpdateInsight);
router.delete('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), insight_controller_js_1.handleDeleteInsight);
exports.default = router;
