"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetCommissions = handleGetCommissions;
exports.handleCreateCommission = handleCreateCommission;
exports.handleUpdateCommissionStatus = handleUpdateCommissionStatus;
const Commission_js_1 = require("../../models/Commission.js");
const Broker_js_1 = require("../../models/Broker.js");
const commissionService_js_1 = require("../../services/commission/commissionService.js");
async function handleGetCommissions(req, res) {
    try {
        const query = {};
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                query.broker = broker._id;
        }
        const commissions = await Commission_js_1.Commission.find(query)
            .populate('property', 'title slug priceAED')
            .populate('broker', 'title agencyName')
            .sort({ closedDate: -1 });
        const totalGross = commissions.reduce((sum, c) => sum + (c.grossCommissionAED || 0), 0);
        const totalNet = commissions.reduce((sum, c) => sum + (c.netBrokerCommissionAED || 0), 0);
        res.json({
            success: true,
            commissions,
            metrics: {
                totalGrossAED: totalGross,
                totalNetBrokerAED: totalNet,
                count: commissions.length
            }
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleCreateCommission(req, res) {
    try {
        const { propertyId, brokerId, clientId, salePriceAED, grossCommissionPct } = req.body;
        let finalBrokerId = brokerId;
        if (req.user?.role === 'BROKER') {
            const broker = await Broker_js_1.Broker.findOne({ user: req.user.id });
            if (broker)
                finalBrokerId = broker._id;
        }
        const commission = await (0, commissionService_js_1.createCommissionRecord)({
            propertyId,
            brokerId: finalBrokerId,
            clientId,
            salePriceAED: Number(salePriceAED),
            grossCommissionPct: grossCommissionPct ? Number(grossCommissionPct) : 2.0
        });
        res.status(201).json({ success: true, message: 'Commission record generated', commission });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
async function handleUpdateCommissionStatus(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const commission = await Commission_js_1.Commission.findById(id);
        if (!commission) {
            res.status(404).json({ success: false, message: 'Commission record not found' });
            return;
        }
        commission.status = status;
        if (status === 'PAID') {
            commission.paidDate = new Date();
        }
        await commission.save();
        res.json({ success: true, message: `Commission marked as ${status}`, commission });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
