import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { registerUser, authenticateUser } from '../../services/auth/authService.js';
import { User } from '../../models/User.js';
import { Broker } from '../../models/Broker.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function handleRegister(req: Request, res: Response): Promise<void> {
  try {
    const { name, email, password, role, phone } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Name, email and password are required.' });
      return;
    }

    const result = await registerUser({ name, email, password, role, phone });
    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      ...result
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleLogin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const result = await authenticateUser(email, password);

    // If user is a broker, find associated Broker record ID
    let brokerId: string | undefined;
    if (result.user.role === 'BROKER') {
      const broker = await Broker.findOne({ user: result.user._id });
      if (broker) brokerId = broker._id.toString();
    }

    res.json({
      success: true,
      message: 'Logged in successfully.',
      ...result,
      brokerId
    });
  } catch (error: any) {
    res.status(401).json({ success: false, message: error.message });
  }
}

export async function handleGetMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    let brokerProfile = null;
    if (user.role === 'BROKER') {
      brokerProfile = await Broker.findOne({ user: user._id });
    }

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        brokerProfile
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleGetUsers(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleUpdateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const { role, isActive } = req.body;
    const updateData: Record<string, any> = {};
    if (role) updateData.role = role;
    if (typeof isActive === 'boolean') updateData.isActive = isActive;

    const user = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-passwordHash');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }
    res.json({ success: true, user });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleUpdateProfile(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { name, phone, avatar } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (name) user.name = name.trim();
    if (phone !== undefined) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar.trim();

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar
      }
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}

export async function handleChangePassword(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      res.status(400).json({ success: false, message: 'Current and new password are required.' });
      return;
    }

    if (newPassword.length < 8) {
      res.status(400).json({ success: false, message: 'New password must be at least 8 characters long.' });
      return;
    }

    const user = await User.findById(req.user.id).select('+passwordHash');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      res.status(400).json({ success: false, message: 'Current password is incorrect.' });
      return;
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

