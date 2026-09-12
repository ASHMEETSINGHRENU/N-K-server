"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const property_controller_js_1 = require("../../controllers/properties/property.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const router = (0, express_1.Router)();
// Public routes
router.get('/', authenticate_js_1.optionalAuthenticate, property_controller_js_1.handleGetProperties);
router.get('/featured', property_controller_js_1.handleGetFeaturedProperties);
router.get('/new-launches', property_controller_js_1.handleGetNewLaunches);
router.get('/:slug', property_controller_js_1.handleGetPropertyBySlug);
// Protected routes (Broker / Admin)
router.post('/', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), property_controller_js_1.handleCreateProperty);
router.put('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('BROKER', 'ADMIN'), property_controller_js_1.handleUpdateProperty);
router.patch('/:id/status', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), property_controller_js_1.handleUpdatePropertyStatus);
router.delete('/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), property_controller_js_1.handleDeleteProperty);
exports.default = router;
