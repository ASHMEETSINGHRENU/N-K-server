"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateLead = handleCreateLead;
exports.handleGetLeads = handleGetLeads;
exports.handleGetLeadById = handleGetLeadById;
exports.handleUpdateLeadStatus = handleUpdateLeadStatus;
exports.handleAddLeadNote = handleAddLeadNote;
exports.handleAssignLead = handleAssignLead;
const Lead_js_1 = require("../../models/Lead.js");
const Broker_js_1 = require("../../models/Broker.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
const leadLifecycle_js_1 = require("../../services/lead/leadLifecycle.js");
const leadAssignment_js_1 = require("../../services/lead/leadAssignment.js");
const leadScoring_js_1 = require("../../services/lead/leadScoring.js");
async function handleCreateLead(req, res) {
    try {
        const { name, email, mobile, preferredContactMethod, propertyId, source, campaign, leadType, message, estimatedBudgetAED } = req.body;
        const clientMobile = req.body.mobile || req.body.phone;
        if (!name || !email || !clientMobile) {
            res.status(400).json({ success: false, message: 'Name, email, and mobile/phone are required.' });
            return;
        }
        // Auto-assign to property listing broker or available broker
        const assignedBrokerId = await (0, leadAssignment_js_1.autoAssignLead)(propertyId);
        const leadId = `NK-LD-${Date.now().toString(36).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
        const newLead = await Lead_js_1.Lead.create({
            leadId,
            name,
            email: email.toLowerCase().trim(),
            mobile: clientMobile.trim(),
            preferredContactMethod: preferredContactMethod || 'WHATSAPP',
            property: propertyId || undefined,
            broker: assignedBrokerId || undefined,
            source: source || 'WEBSITE',
            campaign,
            leadType: leadType || 'INQUIRY',
            message: message || '',
            estimatedBudgetAED: estimatedBudgetAED ? Number(estimatedBudgetAED) : undefined,
            status: 'NEW',
            notes: [
                {
                    author: 'SYSTEM',
                    text: `Inquiry submitted online via ${source || 'Nestandkey Portal'}. Initial lead created.`,
                    createdAt: new Date()
                }
            ],
            lastActivity: new Date()
        });
        // Record initial activity
        await LeadActivity_js_1.LeadActivity.create({
            lead: newLead._id,
            actor: 'SYSTEM',
            type: 'STATUS_CHANGE',
            details: `Lead created from public inquiry. Status: NEW.`
        });
        // We do NOT return mobile/email in the public success response for strict privacy
        res.status(201).json({
            success: true,
            message: 'Your inquiry has been received. A dedicated private property specialist will be in touch shortly.',
            leadReference: newLead.leadId
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleGetLeads(req, res) {
    try {
        const query = {};
        // If broker, only show leads assigned to this broker
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (!broker) {
                res.status(404).json({ success: false, message: 'Broker profile not found' });
                return;
            }
            query.broker = broker._id;
        }
        else if (req.user?.role !== 'ADMIN') {
            res.status(403).json({ success: false, message: 'Unauthorized lead access' });
            return;
        }
        if (req.query.status) {
            query.status = req.query.status;
        }
        if (req.query.source) {
            query.source = req.query.source;
        }
        const leads = await Lead_js_1.Lead.find(query)
            .populate('property', 'title slug priceAED community propertyType featuredImage')
            .populate({
            path: 'broker',
            populate: { path: 'user', select: 'name email' }
        })
            .sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, leads });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetLeadById(req, res) {
    try {
        const { id } = req.params;
        const lead = await Lead_js_1.Lead.findById(id)
            .populate('property')
            .populate({
            path: 'broker',
            populate: { path: 'user', select: 'name email' }
        });
        if (!lead) {
            res.status(404).json({ success: false, message: 'Lead not found' });
            return;
        }
        // Check authorization: broker can only view assigned lead
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (!broker || !lead.broker || lead.broker._id.toString() !== broker._id.toString()) {
                res.status(403).json({ success: false, message: 'Forbidden. This lead is not assigned to you.' });
                return;
            }
        }
        const activities = await LeadActivity_js_1.LeadActivity.find({ lead: lead._id }).sort({ createdAt: -1 });
        const score = (0, leadScoring_js_1.scoreLead)({
            estimatedBudgetAED: lead.estimatedBudgetAED,
            message: lead.message,
            preferredContactMethod: lead.preferredContactMethod,
            leadType: lead.leadType
        });
        res.json({ success: true, lead, activities, score });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleUpdateLeadStatus(req, res) {
    try {
        const { id } = req.params;
        const { status, details } = req.body;
        const actorName = req.user?.email || 'Authorized User';
        const updated = await (0, leadLifecycle_js_1.transitionLeadStatus)(id, status, actorName, details);
        if (!updated) {
            res.status(404).json({ success: false, message: 'Lead not found' });
            return;
        }
        res.json({ success: true, message: `Lead status updated to ${status}`, lead: updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleAddLeadNote(req, res) {
    try {
        const { id } = req.params;
        const { note } = req.body;
        if (!note) {
            res.status(400).json({ success: false, message: 'Note text is required' });
            return;
        }
        const authorName = req.user?.email || 'Broker Specialist';
        const updated = await (0, leadLifecycle_js_1.addLeadNote)(id, authorName, note);
        res.json({ success: true, message: 'Note added', lead: updated });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleAssignLead(req, res) {
    try {
        const { id } = req.params;
        const { brokerId } = req.body;
        if (!brokerId) {
            res.status(400).json({ success: false, message: 'Broker ID is required' });
            return;
        }
        const assigned = await (0, leadAssignment_js_1.assignLeadToBroker)(id, brokerId, req.user?.email || 'ADMIN');
        res.json({ success: true, message: 'Lead successfully assigned to broker', lead: assigned });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
