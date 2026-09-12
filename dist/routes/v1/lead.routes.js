"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const lead_controller_js_1 = require("../../controllers/leads/lead.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const rateLimiter_js_1 = require("../../middleware/rateLimiter.js");
const privacyFilter_js_1 = require("../../middleware/privacyFilter.js");
const router = (0, express_1.Router)();
// Public lead submission (Protected by rate limiter)
router.post('/', rateLimiter_js_1.leadCaptureLimiter, lead_controller_js_1.handleCreateLead);
// Protected routes (Broker and Admin only)
router.get('/', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), privacyFilter_js_1.privacyFilter, lead_controller_js_1.handleGetLeads);
router.get('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), privacyFilter_js_1.privacyFilter, lead_controller_js_1.handleGetLeadById);
router.patch('/:id/status', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), lead_controller_js_1.handleUpdateLeadStatus);
router.post('/:id/notes', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), lead_controller_js_1.handleAddLeadNote);
router.patch('/:id/assign', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), lead_controller_js_1.handleAssignLead);
exports.default = router;
