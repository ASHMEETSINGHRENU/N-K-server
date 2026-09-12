import { Response } from 'express';
import { Commission } from '../../models/Commission.js';
import { Broker } from '../../models/Broker.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { createCommissionRecord } from '../../services/commission/commissionService.js';

export async function handleGetCommissions(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const query: any = {};
    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) query.broker = broker._id;
    }

    const commissions = await Commission.find(query)
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
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateCommission(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { propertyId, brokerId, clientId, salePriceAED, grossCommissionPct } = req.body;
    let finalBrokerId = brokerId;

    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) finalBrokerId = broker._id;
    }

    const commission = await createCommissionRecord({
      propertyId,
      brokerId: finalBrokerId,
      clientId,
      salePriceAED: Number(salePriceAED),
      grossCommissionPct: grossCommissionPct ? Number(grossCommissionPct) : 2.0
    });

    res.status(201).json({ success: true, message: 'Commission record generated', commission });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateCommissionStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const commission = await Commission.findById(id);
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
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
