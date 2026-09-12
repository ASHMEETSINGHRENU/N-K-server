"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cms_controller_js_1 = require("../../controllers/cms/cms.controller.js");
const authenticate_js_1 = require("../../middleware/authenticate.js");
const authorize_js_1 = require("../../middleware/authorize.js");
const router = (0, express_1.Router)();
// Public CMS data
router.get('/website', cms_controller_js_1.handleGetWebsiteContent);
router.get('/communities', cms_controller_js_1.handleGetCommunities);
router.get('/communities/:slug', cms_controller_js_1.handleGetCommunityBySlug);
router.get('/developers', cms_controller_js_1.handleGetDevelopers);
router.get('/developers/:slug', cms_controller_js_1.handleGetDeveloperBySlug);
router.get('/locations', cms_controller_js_1.handleGetLocations);
// Admin CMS updates
router.put('/website', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleUpdateWebsiteContent);
// Admin Communities
router.post('/communities', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleCreateCommunity);
router.put('/communities/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleUpdateCommunity);
router.delete('/communities/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleDeleteCommunity);
// Admin Developers
router.post('/developers', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleCreateDeveloper);
router.put('/developers/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleUpdateDeveloper);
router.delete('/developers/:id', authenticate_js_1.authenticate, (0, authorize_js_1.authorize)('ADMIN'), cms_controller_js_1.handleDeleteDeveloper);
exports.default = router;
