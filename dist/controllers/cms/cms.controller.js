"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetWebsiteContent = handleGetWebsiteContent;
exports.handleUpdateWebsiteContent = handleUpdateWebsiteContent;
exports.handleGetCommunities = handleGetCommunities;
exports.handleGetCommunityBySlug = handleGetCommunityBySlug;
exports.handleGetDevelopers = handleGetDevelopers;
exports.handleGetDeveloperBySlug = handleGetDeveloperBySlug;
exports.handleGetLocations = handleGetLocations;
exports.handleCreateCommunity = handleCreateCommunity;
exports.handleUpdateCommunity = handleUpdateCommunity;
exports.handleDeleteCommunity = handleDeleteCommunity;
exports.handleCreateDeveloper = handleCreateDeveloper;
exports.handleUpdateDeveloper = handleUpdateDeveloper;
exports.handleDeleteDeveloper = handleDeleteDeveloper;
const WebsiteContent_js_1 = require("../../models/WebsiteContent.js");
const Community_js_1 = require("../../models/Community.js");
const Developer_js_1 = require("../../models/Developer.js");
const Location_js_1 = require("../../models/Location.js");
async function handleGetWebsiteContent(req, res) {
    try {
        let content = await WebsiteContent_js_1.WebsiteContent.findOne();
        if (!content) {
            content = await WebsiteContent_js_1.WebsiteContent.create({});
        }
        res.json({ success: true, content });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleUpdateWebsiteContent(req, res) {
    try {
        let content = await WebsiteContent_js_1.WebsiteContent.findOne();
        if (!content) {
            content = await WebsiteContent_js_1.WebsiteContent.create(req.body);
        }
        else {
            Object.assign(content, req.body);
            await content.save();
        }
        res.json({ success: true, message: 'Website CMS content updated successfully', content });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleGetCommunities(req, res) {
    try {
        const communities = await Community_js_1.Community.find().sort({ isFeatured: -1, name: 1 });
        res.json({ success: true, communities });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetCommunityBySlug(req, res) {
    try {
        const { slug } = req.params;
        const community = await Community_js_1.Community.findOne({ slug });
        if (!community) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        res.json({ success: true, community });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetDevelopers(req, res) {
    try {
        const developers = await Developer_js_1.Developer.find().sort({ name: 1 });
        res.json({ success: true, developers });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetDeveloperBySlug(req, res) {
    try {
        const { slug } = req.params;
        const developer = await Developer_js_1.Developer.findOne({ slug });
        if (!developer) {
            res.status(404).json({ success: false, message: 'Developer not found' });
            return;
        }
        res.json({ success: true, developer });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetLocations(req, res) {
    try {
        const locations = await Location_js_1.Location.find({ isActive: true });
        res.json({ success: true, locations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
// Admin Community CRUD
async function handleCreateCommunity(req, res) {
    try {
        const community = await Community_js_1.Community.create(req.body);
        res.status(201).json({ success: true, community });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateCommunity(req, res) {
    try {
        const { id } = req.params;
        const community = await Community_js_1.Community.findByIdAndUpdate(id, req.body, { new: true });
        if (!community) {
            res.status(404).json({ success: false, message: 'Community not found' });
            return;
        }
        res.json({ success: true, community });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleDeleteCommunity(req, res) {
    try {
        const { id } = req.params;
        await Community_js_1.Community.findByIdAndDelete(id);
        res.json({ success: true, message: 'Community deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
// Admin Developer CRUD
async function handleCreateDeveloper(req, res) {
    try {
        const developer = await Developer_js_1.Developer.create(req.body);
        res.status(201).json({ success: true, developer });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateDeveloper(req, res) {
    try {
        const { id } = req.params;
        const developer = await Developer_js_1.Developer.findByIdAndUpdate(id, req.body, { new: true });
        if (!developer) {
            res.status(404).json({ success: false, message: 'Developer not found' });
            return;
        }
        res.json({ success: true, developer });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleDeleteDeveloper(req, res) {
    try {
        const { id } = req.params;
        await Developer_js_1.Developer.findByIdAndDelete(id);
        res.json({ success: true, message: 'Developer deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
