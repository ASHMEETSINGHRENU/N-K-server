"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetInsights = handleGetInsights;
exports.handleGetInsightBySlug = handleGetInsightBySlug;
exports.handleCreateInsight = handleCreateInsight;
exports.handleUpdateInsight = handleUpdateInsight;
exports.handleDeleteInsight = handleDeleteInsight;
const Insight_js_1 = require("../../models/Insight.js");
const slugify_js_1 = require("../../shared/utils/slugify.js");
async function handleGetInsights(req, res) {
    try {
        const query = {};
        if (req.query.category) {
            query.category = req.query.category;
        }
        // Unless admin, show only published
        query.isPublished = true;
        const insights = await Insight_js_1.Insight.find(query).sort({ publishedAt: -1 });
        res.json({ success: true, count: insights.length, insights });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetInsightBySlug(req, res) {
    try {
        const { slug } = req.params;
        const insight = await Insight_js_1.Insight.findOne({ slug });
        if (!insight) {
            res.status(404).json({ success: false, message: 'Insight article not found' });
            return;
        }
        const related = await Insight_js_1.Insight.find({
            _id: { $ne: insight._id },
            category: insight.category,
            isPublished: true
        }).limit(3);
        res.json({ success: true, insight, related });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateInsight(req, res) {
    try {
        const body = req.body;
        const slug = body.slug || (0, slugify_js_1.slugify)(body.title);
        const insight = await Insight_js_1.Insight.create({
            ...body,
            slug,
            publishedAt: body.isPublished !== false ? new Date() : undefined
        });
        res.status(201).json({ success: true, message: 'Insight article created', insight });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateInsight(req, res) {
    try {
        const { id } = req.params;
        const insight = await Insight_js_1.Insight.findByIdAndUpdate(id, req.body, { new: true });
        if (!insight) {
            res.status(404).json({ success: false, message: 'Insight not found' });
            return;
        }
        res.json({ success: true, message: 'Insight article updated', insight });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleDeleteInsight(req, res) {
    try {
        const { id } = req.params;
        await Insight_js_1.Insight.findByIdAndDelete(id);
        res.json({ success: true, message: 'Insight removed' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
