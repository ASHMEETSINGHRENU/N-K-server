"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignLeadToBroker = assignLeadToBroker;
exports.autoAssignLead = autoAssignLead;
const Broker_js_1 = require("../../models/Broker.js");
const Property_js_1 = require("../../models/Property.js");
const Lead_js_1 = require("../../models/Lead.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
const Notification_js_1 = require("../../models/Notification.js");
async function assignLeadToBroker(leadId, brokerId, assignedByName = 'SYSTEM') {
    const lead = await Lead_js_1.Lead.findById(leadId);
    const broker = await Broker_js_1.Broker.findById(brokerId).populate('user');
    if (!lead || !broker)
        return null;
    lead.broker = broker._id;
    lead.lastActivity = new Date();
    await lead.save();
    await LeadActivity_js_1.LeadActivity.create({
        lead: lead._id,
        actor: assignedByName,
        type: 'STATUS_CHANGE',
        details: `Lead assigned to Broker ${broker.title} (${broker.agencyName})`
    });
    // Notify broker
    if (broker.user) {
        const userId = broker.user._id || broker.user;
        await Notification_js_1.Notification.create({
            recipient: userId,
            title: 'New High-Value Lead Assigned',
            message: `You have been assigned inquiry #${lead.leadId} for property reference ${lead.property || 'General Advisory'}.`,
            type: 'NEW_LEAD',
            link: `/broker/leads/${lead._id}`
        });
    }
    return lead;
}
/**
 * Intelligent auto-assignment:
 * 1. Checks if the property has a dedicated listing broker
 * 2. Otherwise falls back to active brokers in round-robin fashion
 */
async function autoAssignLead(propertyId) {
    if (propertyId) {
        const property = await Property_js_1.Property.findById(propertyId);
        if (property && property.assignedBroker) {
            return property.assignedBroker.toString();
        }
    }
    // Fallback to active verified broker with lowest active leads count
    const availableBrokers = await Broker_js_1.Broker.find({ isActive: true, isVerified: true }).sort({ activeListingsCount: 1 });
    if (availableBrokers.length > 0) {
        return availableBrokers[0]._id.toString();
    }
    return undefined;
}
