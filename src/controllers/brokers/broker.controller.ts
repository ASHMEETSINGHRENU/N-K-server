import { Request, Response } from 'express';
import { Broker } from '../../models/Broker.js';
import { User } from '../../models/User.js';
import { Property } from '../../models/Property.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';
import { hashPassword } from '../../services/auth/authService.js';

export async function handleGetBrokers(req: Request, res: Response): Promise<void> {
  try {
    const brokers = await Broker.find({ isActive: true })
      .populate('user', 'name avatar')
      .select('-reraNumber -commissionSplitPct'); // Hide internal license/split details for public directory
    res.json({ success: true, brokers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetAllBrokersAdmin(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const brokers = await Broker.find().populate('user', 'name email phone avatar isActive');
    res.json({ success: true, brokers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetBrokerProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const broker = await Broker.findOne({ user: req.user?.id }).populate('user');
    if (!broker) {
      res.status(404).json({ success: false, message: 'Broker profile not found' });
      return;
    }

    const properties = await Property.find({ assignedBroker: broker._id });
    res.json({ success: true, broker, properties });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleCreateBroker(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { name, email, password, reraNumber, brn, title, photoUrl, languages, specializations, commissionSplitPct } =
      req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'User with this email already exists.' });
      return;
    }

    const passwordHash = await hashPassword(password || 'Broker@123456');
    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      passwordHash,
      role: 'BROKER',
      isActive: true
    });

    const broker = await Broker.create({
      user: user._id,
      reraNumber,
      brn: brn || `BRN-${Math.floor(10000 + Math.random() * 90000)}`,
      title: title || 'Private Client Advisor',
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80',
      languages: languages || ['English', 'Arabic'],
      specializations: specializations || ['Palm Jumeirah', 'Penthouses'],
      commissionSplitPct: commissionSplitPct || 60,
      isActive: true,
      isVerified: true
    });

    res.status(201).json({ success: true, message: 'Broker created successfully', broker });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleUpdateBroker(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const broker = await Broker.findById(id);
    if (!broker) {
      res.status(404).json({ success: false, message: 'Broker not found' });
      return;
    }

    Object.assign(broker, req.body);
    await broker.save();

    res.json({ success: true, message: 'Broker updated successfully', broker });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
