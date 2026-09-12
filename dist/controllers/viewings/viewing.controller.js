"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetViewings = handleGetViewings;
exports.handleCreateViewing = handleCreateViewing;
exports.handleUpdateViewingStatus = handleUpdateViewingStatus;
const Viewing_js_1 = require("../../models/Viewing.js");
const Broker_js_1 = require("../../models/Broker.js");
async function handleGetViewings(req, res) {
    try {
        const query = {};
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                query.broker = broker._id;
        }
        const viewings = await Viewing_js_1.Viewing.find(query)
            .populate('property', 'title slug priceAED community featuredImage')
            .populate('lead', 'name leadId')
            .populate('broker', 'title photoUrl agencyName')
            .sort({ viewingDate: 1 });
        res.json({ success: true, viewings });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateViewing(req, res) {
    try {
        let brokerId = req.body.broker;
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                brokerId = broker._id;
        }
        const viewing = await Viewing_js_1.Viewing.create({
            ...req.body,
            broker: brokerId,
            status: req.body.status || 'CONFIRMED'
        });
        res.status(201).json({ success: true, message: 'Viewing scheduled successfully', viewing });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateViewingStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, clientFeedback, brokerNotes } = req.body;
        const viewing = await Viewing_js_1.Viewing.findById(id);
        if (!viewing) {
            res.status(404).json({ success: false, message: 'Viewing not found' });
            return;
        }
        if (status)
            viewing.status = status;
        if (clientFeedback)
            viewing.clientFeedback = clientFeedback;
        if (brokerNotes)
            viewing.brokerNotes = brokerNotes;
        await viewing.save();
        res.json({ success: true, message: `Viewing updated to ${status}`, viewing });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
