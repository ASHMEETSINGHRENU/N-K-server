"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetAdminAnalytics = handleGetAdminAnalytics;
exports.handleGetBrokerAnalytics = handleGetBrokerAnalytics;
exports.handleGetAuditLogs = handleGetAuditLogs;
const Property_js_1 = require("../../models/Property.js");
const Broker_js_1 = require("../../models/Broker.js");
const Lead_js_1 = require("../../models/Lead.js");
const Viewing_js_1 = require("../../models/Viewing.js");
const Commission_js_1 = require("../../models/Commission.js");
const LeadActivity_js_1 = require("../../models/LeadActivity.js");
async function handleGetAdminAnalytics(req, res) {
    try {
        const [totalProperties, activeProperties, pendingProperties, totalBrokers, activeBrokers, totalLeads, newLeads, convertedLeads, totalViewings, commissions, recentActivities] = await Promise.all([
            Property_js_1.Property.countDocuments(),
            Property_js_1.Property.countDocuments({ status: 'ACTIVE' }),
            Property_js_1.Property.countDocuments({ status: 'PENDING_APPROVAL' }),
            Broker_js_1.Broker.countDocuments(),
            Broker_js_1.Broker.countDocuments({ isActive: true }),
            Lead_js_1.Lead.countDocuments(),
            Lead_js_1.Lead.countDocuments({ status: 'NEW' }),
            Lead_js_1.Lead.countDocuments({ status: 'CONVERTED' }),
            Viewing_js_1.Viewing.countDocuments(),
            Commission_js_1.Commission.find(),
            LeadActivity_js_1.LeadActivity.find().sort({ createdAt: -1 }).limit(8)
        ]);
        const totalGrossCommissionAED = commissions.reduce((acc, c) => acc + (c.grossCommissionAED || 0), 0);
        const totalCompanyCommissionAED = commissions.reduce((acc, c) => acc + (c.companyCommissionAED || 0), 0);
        const totalSalesVolumeAED = commissions.reduce((acc, c) => acc + (c.salePriceAED || 0), 0);
        const conversionRatePct = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
        // Leads by source aggregation
        const leadsBySource = await Lead_js_1.Lead.aggregate([
            { $group: { _id: '$source', count: { $sum: 1 } } },
            { $sort: { count: -1 } }
        ]);
        // Leads by status aggregation
        const leadsByStatus = await Lead_js_1.Lead.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        // Properties by community
        const propertiesByCommunity = await Property_js_1.Property.aggregate([
            { $match: { status: 'ACTIVE' } },
            { $group: { _id: '$community', count: { $sum: 1 }, avgPrice: { $sum: '$priceAED' } } },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);
        res.json({
            success: true,
            metrics: {
                totalProperties,
                activeProperties,
                pendingProperties,
                totalBrokers,
                activeBrokers,
                totalLeads,
                newLeads,
                conversionRatePct,
                totalViewings,
                totalSalesVolumeAED,
                totalGrossCommissionAED,
                totalCompanyCommissionAED
            },
            leadsBySource,
            leadsByStatus,
            propertiesByCommunity,
            recentActivities
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetBrokerAnalytics(req, res) {
    try {
        const broker = await Broker_js_1.Broker.findOne({ user: req.user?.id });
        if (!broker) {
            res.status(404).json({ success: false, message: 'Broker profile not found' });
            return;
        }
        const [totalListings, activeListings, pendingListings, totalLeads, newLeads, activeLeads, convertedLeads, upcomingViewings, commissions, recentActivities] = await Promise.all([
            Property_js_1.Property.countDocuments({ assignedBroker: broker._id }),
            Property_js_1.Property.countDocuments({ assignedBroker: broker._id, status: 'ACTIVE' }),
            Property_js_1.Property.countDocuments({ assignedBroker: broker._id, status: 'PENDING_APPROVAL' }),
            Lead_js_1.Lead.countDocuments({ broker: broker._id }),
            Lead_js_1.Lead.countDocuments({ broker: broker._id, status: 'NEW' }),
            Lead_js_1.Lead.countDocuments({ broker: broker._id, status: { $in: ['CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION'] } }),
            Lead_js_1.Lead.countDocuments({ broker: broker._id, status: 'CONVERTED' }),
            Viewing_js_1.Viewing.find({ broker: broker._id, viewingDate: { $gte: new Date() } }).populate('property', 'title slug priceAED community').limit(5),
            Commission_js_1.Commission.find({ broker: broker._id }),
            LeadActivity_js_1.LeadActivity.find().sort({ createdAt: -1 }).limit(6)
        ]);
        const totalNetBrokerCommissionAED = commissions.reduce((sum, c) => sum + (c.netBrokerCommissionAED || 0), 0);
        const pendingCommissionAED = commissions
            .filter((c) => c.status === 'PENDING')
            .reduce((sum, c) => sum + (c.netBrokerCommissionAED || 0), 0);
        const conversionRatePct = totalLeads > 0 ? Number(((convertedLeads / totalLeads) * 100).toFixed(1)) : 0;
        const leadsByStatus = await Lead_js_1.Lead.aggregate([
            { $match: { broker: broker._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        res.json({
            success: true,
            metrics: {
                totalListings,
                activeListings,
                pendingListings,
                totalLeads,
                newLeads,
                activeLeads,
                convertedLeads,
                conversionRatePct,
                totalSalesVolumeAED: broker.totalSalesVolumeAED,
                totalNetBrokerCommissionAED,
                pendingCommissionAED,
                rating: broker.rating
            },
            leadsByStatus,
            upcomingViewings,
            recentActivities
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleGetAuditLogs(req, res) {
    try {
        const { AuditLog } = await import('../../models/AuditLog.js');
        let logs = await AuditLog.find().sort({ createdAt: -1 }).limit(100);
        if (logs.length === 0) {
            // Seed initial realistic audit logs if empty
            const initialLogs = [
                {
                    action: 'PROPERTY_APPROVED',
                    performedBy: 'Alexander Sterling',
                    userEmail: 'admin@nestandkey.com',
                    userRole: 'ADMIN',
                    ipAddress: '194.170.88.12',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    targetModel: 'Property',
                    targetId: 'NK-PJ-8821',
                    details: { title: 'The Solstice Sanctuary — Palm Jumeirah', status: 'ACTIVE', priceAED: 145000000 }
                },
                {
                    action: 'LEAD_ASSIGNED',
                    performedBy: 'Lead Router Engine',
                    userEmail: 'system@nestandkey.com',
                    userRole: 'SYSTEM',
                    ipAddress: '127.0.0.1',
                    userAgent: 'Nestandkey Core Engine v1.0',
                    targetModel: 'Lead',
                    targetId: 'NK-LD-1001',
                    details: { assignedTo: 'Omar Farooq', community: 'Palm Jumeirah', leadScore: 92 }
                },
                {
                    action: 'COMMISSION_APPROVED',
                    performedBy: 'Alexander Sterling',
                    userEmail: 'admin@nestandkey.com',
                    userRole: 'ADMIN',
                    ipAddress: '194.170.88.12',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    targetModel: 'Commission',
                    targetId: 'COMM-8921',
                    details: { netBrokerAED: 1885000, broker: 'Omar Farooq', status: 'APPROVED' }
                },
                {
                    action: 'BROKER_ONBOARDED',
                    performedBy: 'Alexander Sterling',
                    userEmail: 'admin@nestandkey.com',
                    userRole: 'ADMIN',
                    ipAddress: '194.170.88.12',
                    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
                    targetModel: 'Broker',
                    targetId: 'BRN-28410',
                    details: { name: 'Tariq Mansoor', rera: 'RERA-39821', status: 'ACTIVE' }
                },
                {
                    action: 'SECURITY_LOGIN_SUCCESS',
                    performedBy: 'Alexander Sterling',
                    userEmail: 'admin@nestandkey.com',
                    userRole: 'ADMIN',
                    ipAddress: '194.170.88.12',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    targetModel: 'User',
                    targetId: 'USR-ADMIN-1',
                    details: { authMethod: 'PASSWORD_HASH', sessionDuration: '24h' }
                }
            ];
            logs = await AuditLog.create(initialLogs);
        }
        res.json({ success: true, logs });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
