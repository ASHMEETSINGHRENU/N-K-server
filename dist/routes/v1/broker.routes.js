"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const broker_controller_js_1 = require("../../controllers/brokers/broker.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const router = (0, express_1.Router)();
// Public broker directory
router.get('/', broker_controller_js_1.handleGetBrokers);
// Authenticated broker self profile
router.get('/profile', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER'), broker_controller_js_1.handleGetBrokerProfile);
// Admin broker management
router.get('/admin/all', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), broker_controller_js_1.handleGetAllBrokersAdmin);
router.post('/', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), broker_controller_js_1.handleCreateBroker);
router.put('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), broker_controller_js_1.handleUpdateBroker);
exports.default = router;
