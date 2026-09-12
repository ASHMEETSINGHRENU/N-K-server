import { Response } from 'express';
import { Viewing } from '../../models/Viewing.js';
import { Broker } from '../../models/Broker.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function handleGetViewings(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const query: any = {};
    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) query.broker = broker._id;
    }

    const viewings = await Viewing.find(query)
      .populate('property', 'title slug priceAED community featuredImage')
      .populate('lead', 'name leadId')
      .populate('broker', 'title photoUrl agencyName')
      .sort({ viewingDate: 1 });

    res.json({ success: true, viewings });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateViewing(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let brokerId = req.body.broker;
    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) brokerId = broker._id;
    }

    const viewing = await Viewing.create({
      ...req.body,
      broker: brokerId,
      status: req.body.status || 'CONFIRMED'
    });

    res.status(201).json({ success: true, message: 'Viewing scheduled successfully', viewing });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateViewingStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { status, clientFeedback, brokerNotes } = req.body;

    const viewing = await Viewing.findById(id);
    if (!viewing) {
      res.status(404).json({ success: false, message: 'Viewing not found' });
      return;
    }

    if (status) viewing.status = status;
    if (clientFeedback) viewing.clientFeedback = clientFeedback;
    if (brokerNotes) viewing.brokerNotes = brokerNotes;

    await viewing.save();
    res.json({ success: true, message: `Viewing updated to ${status}`, viewing });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
