"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleCreateLead = handleCreateLead;
exports.handleGetMyLeads = handleGetMyLeads;
exports.handleGetLeads = handleGetLeads;
exports.handleGetLeadById = handleGetLeadById;
exports.handleUpdateLeadStatus = handleUpdateLeadStatus;
exports.handleAddLeadNote = handleAddLeadNote;
exports.handleAssignLead = handleAssignLead;
const Lead_js_1 = require("../../models/Lead.js");
const Broker_js_1 = require("../../models/Broker.js");
const User_js_1 = require("../../models/User.js");
const Notification_js_1 = require("../../models/Notification.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
const leadLifecycle_js_1 = require("../../services/lead/leadLifecycle.js");
const leadAssignment_js_1 = require("../../services/lead/leadAssignment.js");
const leadScoring_js_1 = require("../../services/lead/leadScoring.js");
async function handleCreateLead(req, res) {
    try {
        const { email: inputEmail, preferredContactMethod, propertyId, source, campaign, leadType, message, estimatedBudgetAED, isAnonymous, projectName, assignedRM, status: inputStatus } = req.body;
        const leadNum = Math.floor(100000 + Math.random() * 900000);
        const leadId = req.body.leadId || `CS-LEAD-${leadNum}`;
        let name = req.body.name;
        let email = inputEmail;
        let clientMobile = req.body.mobile || req.body.phone;
        if (isAnonymous) {
            name = name || `Confidential Client (${leadId})`;
            email = email || `${leadId.toLowerCase()}@crestshore-private.ae`;
            clientMobile = clientMobile || '+971 4 000 0000';
        }
        else {
            if (!name && !email && !clientMobile) {
                // Fallback to anonymous ID if broker submitted without contact info
                name = `Confidential Client (${leadId})`;
                email = `${leadId.toLowerCase()}@crestshore-private.ae`;
                clientMobile = '+971 4 000 0000';
            }
            else {
                name = name || `Client Mandate (${leadId})`;
                email = email || `${leadId.toLowerCase()}@crestshore-private.ae`;
                clientMobile = clientMobile || '+971 4 000 0000';
            }
        }
        // Determine broker assignment: if authenticated as broker, assign directly to them
        let assignedBrokerId = undefined;
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker) {
                assignedBrokerId = broker._id;
            }
        }
        if (!assignedBrokerId) {
            assignedBrokerId = await (0, leadAssignment_js_1.autoAssignLead)(propertyId);
        }
        const initialStage = inputStatus || 'NEW';
        const effectiveRM = assignedRM || 'Tariq Al-Mansoor (Principal RM)';
        const newLead = await Lead_js_1.Lead.create({
            leadId,
            name,
            email: email.toLowerCase().trim(),
            mobile: clientMobile.trim(),
            preferredContactMethod: preferredContactMethod || 'WHATSAPP',
            property: propertyId || undefined,
            broker: assignedBrokerId || undefined,
            source: source || 'REFERRAL',
            campaign,
            leadType: leadType || 'INQUIRY',
            message: message || '',
            estimatedBudgetAED: estimatedBudgetAED ? Number(estimatedBudgetAED) : undefined,
            status: initialStage,
            isAnonymous: Boolean(isAnonymous),
            assignedRM: effectiveRM,
            projectName: projectName || '',
            notes: [
                {
                    author: req.user?.email || 'SYSTEM',
                    text: `Inquiry registered for ${projectName || 'Luxury Residence'}. Assigned RM: ${effectiveRM}. Status: ${initialStage}.`,
                    createdAt: new Date()
                }
            ],
            lastActivity: new Date()
        });
        // Record initial CRM activity with exact timestamp
        await LeadActivity_js_1.LeadActivity.create({
            lead: newLead._id,
            actor: req.user?.email || 'SYSTEM',
            type: 'STATUS_CHANGE',
            details: `Lead registered (${isAnonymous ? 'Confidential / Anonymous' : name}) for ${projectName || 'Dubai Prime Portfolio'}. Assigned RM: ${effectiveRM}. Status: ${initialStage}.`
        });
        // Notify broker if assigned
        let assignedBrokerDoc = null;
        if (assignedBrokerId) {
            assignedBrokerDoc = await Broker_js_1.Broker.findById(assignedBrokerId).populate('user', 'name email');
            if (assignedBrokerDoc && assignedBrokerDoc.user) {
                const brokerUserId = assignedBrokerDoc.user._id || assignedBrokerDoc.user;
                await Notification_js_1.Notification.create({
                    recipient: brokerUserId,
                    title: 'New Client Inquiry Received',
                    message: `${name} has inquired regarding ${propertyId ? 'a luxury residence' : 'private advisory'}. Contact: ${clientMobile}`,
                    type: 'NEW_LEAD',
                    link: `/broker/leads/${newLead._id}`
                });
            }
        }
        // Notify registered client if user exists with this email
        const clientUser = await User_js_1.User.findOne({ email: email.toLowerCase().trim() });
        if (clientUser) {
            const brokerName = assignedBrokerDoc?.title || assignedBrokerDoc?.agencyName || 'a dedicated advisor';
            await Notification_js_1.Notification.create({
                recipient: clientUser._id,
                title: 'Inquiry Registered with Private Desk',
                message: `Your inquiry #${leadId} has been assigned to ${brokerName}. They will reach out via ${preferredContactMethod || 'WhatsApp'} shortly.`,
                type: 'STATUS_CHANGE',
                link: '/profile'
            });
        }
        res.status(201).json({
            success: true,
            message: 'Your inquiry has been received. A dedicated private property specialist will be in touch shortly.',
            leadReference: newLead.leadId,
            assignedBroker: assignedBrokerDoc
                ? {
                    _id: assignedBrokerDoc._id,
                    title: assignedBrokerDoc.title,
                    agencyName: assignedBrokerDoc.agencyName,
                    photoUrl: assignedBrokerDoc.photoUrl,
                    whatsappNumber: assignedBrokerDoc.whatsappNumber
                }
                : null
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleGetMyLeads(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const user = await User_js_1.User.findById(req.user.id);
        const userEmail = (user?.email || req.user.email || '').toLowerCase().trim();
        if (!userEmail) {
            res.status(400).json({ success: false, message: 'User email not found' });
            return;
        }
        const leads = await Lead_js_1.Lead.find({ email: userEmail })
            .populate('property', 'title slug priceAED community propertyType featuredImage images')
            .populate({
            path: 'broker',
            populate: { path: 'user', select: 'name email phone avatar' }
        })
            .sort({ createdAt: -1 });
        res.json({ success: true, count: leads.length, leads });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
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
