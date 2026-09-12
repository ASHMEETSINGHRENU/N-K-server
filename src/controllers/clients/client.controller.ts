import { Response } from 'express';
import { Client } from '../../models/Client.js';
import { Broker } from '../../models/Broker.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function handleGetClients(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const query: any = {};

    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) query.assignedBroker = broker._id;
    }

    const clients = await Client.find(query).sort({ updatedAt: -1 });
    res.json({ success: true, count: clients.length, clients });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateClient(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    let brokerId = req.body.assignedBroker;

    if (req.user?.role === 'BROKER') {
      const broker = await Broker.findOne({ user: req.user.id });
      if (broker) brokerId = broker._id;
    }

    const client = await Client.create({
      ...req.body,
      assignedBroker: brokerId
    });

    res.status(201).json({ success: true, message: 'Client profile created', client });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleGetClientById(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const client = await Client.findById(id).populate('assignedBroker');
    if (!client) {
      res.status(404).json({ success: false, message: 'Client profile not found' });
      return;
    }
    res.json({ success: true, client });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}
