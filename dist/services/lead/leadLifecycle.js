"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transitionLeadStatus = transitionLeadStatus;
exports.addLeadNote = addLeadNote;
const Lead_js_1 = require("../../models/Lead.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
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
    return lead;
}
