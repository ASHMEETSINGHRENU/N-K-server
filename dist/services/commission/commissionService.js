"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCommissionRecord = createCommissionRecord;
const Commission_js_1 = require("../../models/Commission.js");
const Broker_js_1 = require("../../models/Broker.js");
async function createCommissionRecord(data) {
    const broker = await Broker_js_1.Broker.findById(data.brokerId);
    if (!broker)
        throw new Error('Broker not found');
    const grossPct = data.grossCommissionPct || 2.0;
    const grossAmount = (data.salePriceAED * grossPct) / 100;
    const splitPct = broker.commissionSplitPct || 60;
    const netBroker = (grossAmount * splitPct) / 100;
    const companyShare = grossAmount - netBroker;
    const transactionId = `TX-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const commission = await Commission_js_1.Commission.create({
        transactionId,
        property: data.propertyId,
        broker: data.brokerId,
        client: data.clientId,
        salePriceAED: data.salePriceAED,
        grossCommissionPct: grossPct,
        grossCommissionAED: grossAmount,
        brokerSplitPct: splitPct,
        netBrokerCommissionAED: netBroker,
        companyCommissionAED: companyShare,
        status: 'PENDING',
        closedDate: new Date()
    });
    // Increment broker total sales volume
    broker.totalSalesVolumeAED += data.salePriceAED;
    await broker.save();
    return commission;
}
