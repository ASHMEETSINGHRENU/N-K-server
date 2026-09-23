import { Request, Response } from 'express';
import { Notification } from '../../models/Notification.js';
import { User } from '../../models/User.js';
import { AuthenticatedRequest } from '../../middleware/authenticate.js';

export async function handleGetNotifications(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const notifications = await Notification.find({ recipient: req.user.id })
      .sort({ createdAt: -1 })
      .limit(30);

    const unreadCount = await Notification.countDocuments({
      recipient: req.user.id,
      isRead: false
    });

    res.json({
      success: true,
      count: notifications.length,
      unreadCount,
      notifications
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleMarkAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { id } = req.params;
    const notification = await Notification.findOneAndUpdate(
      { _id: id, recipient: req.user.id },
      { isRead: true },
      { new: true }
    );

    if (!notification) {
      res.status(404).json({ success: false, message: 'Notification not found' });
      return;
    }

    res.json({ success: true, notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleMarkAllAsRead(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    await Notification.updateMany(
      { recipient: req.user.id, isRead: false },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

export async function handleSendNotification(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const { recipientEmail, recipientId, title, message, link, type } = req.body;

    let targetUserId = recipientId;
    if (!targetUserId && recipientEmail) {
      const foundUser = await User.findOne({ email: recipientEmail.toLowerCase().trim() });
      if (foundUser) {
        targetUserId = foundUser._id;
      }
    }

    if (!targetUserId) {
      res.status(404).json({ success: false, message: 'Recipient user not found' });
      return;
    }

    const notification = await Notification.create({
      recipient: targetUserId,
      title: title || 'Property Update',
      message: message || '',
      type: type || 'STATUS_CHANGE',
      link: link || '/profile',
      isRead: false
    });

    res.status(201).json({
      success: true,
      message: 'Notification sent successfully',
      notification
    });
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message });
  }
}
