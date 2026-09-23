"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionLeadStatus = transitionLeadStatus;
exports.addLeadNote = addLeadNote;
const Lead_js_1 = require("../../models/Lead.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
const Notification_js_1 = require("../../models/Notification.js");
const User_js_1 = require("../../models/User.js");
async function transitionLeadStatus(leadId, newStatus, actorName, details) {
    const lead = await Lead_js_1.Lead.findById(leadId);
    if (!lead)
        return null;
    const previousStatus = lead.status;
    lead.status = newStatus;
    lead.lastActivity = new Date();
    await lead.save();
    // Create immutable activity audit trail
    await LeadActivity_js_1.LeadActivity.create({
        lead: lead._id,
        actor: actorName,
        type: 'STATUS_CHANGE',
        details: details || `Status changed from ${previousStatus} to ${newStatus}`,
        previousValue: previousStatus,
        newValue: newStatus
    });
    // Notify client user if registered with this email
    try {
        const clientUser = await User_js_1.User.findOne({ email: lead.email.toLowerCase().trim() });
        if (clientUser) {
            const statusLabels = {
                CONTACTED: 'Your property specialist has reached out regarding your inquiry',
                QUALIFIED: 'Your VIP client file has been verified and qualified',
                VIEWING: 'A private viewing appointment has been scheduled for your residence',
                NEGOTIATION: 'Active private offer negotiations are in progress',
                CONVERTED: 'Congratulations! Residence acquisition confirmed',
                LOST: 'Inquiry archived'
            };
            const friendlyMsg = statusLabels[newStatus] || `Status updated to ${newStatus}`;
            await Notification_js_1.Notification.create({
                recipient: clientUser._id,
                title: `Property Inquiry Update: ${newStatus}`,
                message: `${friendlyMsg}. Reference #${lead.leadId}.`,
                type: 'STATUS_CHANGE',
                link: '/profile'
            });
        }
    }
    catch (notifErr) {
        console.error('Failed to dispatch client notification:', notifErr);
    }
    return lead;
}
async function addLeadNote(leadId, authorName, noteText) {
    const lead = await Lead_js_1.Lead.findById(leadId);
    if (!lead)
        return null;
    lead.notes.push({
        author: authorName,
        text: noteText,
        createdAt: new Date()
    });
    lead.lastActivity = new Date();
    await lead.save();
    await LeadActivity_js_1.LeadActivity.create({
        lead: lead._id,
        actor: authorName,
        type: 'NOTE_ADDED',
        details: `Note added: "${noteText.slice(0, 80)}${noteText.length > 80 ? '...' : ''}"`
    });
    // Notify client user if registered
    try {
        const clientUser = await User_js_1.User.findOne({ email: lead.email.toLowerCase().trim() });
        if (clientUser) {
            await Notification_js_1.Notification.create({
                recipient: clientUser._id,
                title: 'New Message from Property Advisor',
                message: `Advisor noted: "${noteText.slice(0, 100)}${noteText.length > 100 ? '...' : ''}"`,
                type: 'STATUS_CHANGE',
                link: '/profile'
            });
        }
    }
    catch (notifErr) {
        console.error('Failed to dispatch client note notification:', notifErr);
    }
    return lead;
}
