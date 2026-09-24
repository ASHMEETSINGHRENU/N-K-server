"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGetNotifications = handleGetNotifications;
exports.handleMarkAsRead = handleMarkAsRead;
exports.handleMarkAllAsRead = handleMarkAllAsRead;
exports.handleSendNotification = handleSendNotification;
const Notification_js_1 = require("../../models/Notification.js");
const User_js_1 = require("../../models/User.js");
async function handleGetNotifications(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const notifications = await Notification_js_1.Notification.find({ recipient: req.user.id })
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = await Notification_js_1.Notification.countDocuments({
            recipient: req.user.id,
            isRead: false
        });
        res.json({
            success: true,
            count: notifications.length,
            unreadCount,
            notifications
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleMarkAsRead(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        const { id } = req.params;
        const notification = await Notification_js_1.Notification.findOneAndUpdate({ _id: id, recipient: req.user.id }, { isRead: true }, { new: true });
        if (!notification) {
            res.status(404).json({ success: false, message: 'Notification not found' });
            return;
        }
        res.json({ success: true, notification });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleMarkAllAsRead(req, res) {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: 'Not authenticated' });
            return;
        }
        await Notification_js_1.Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
        res.json({ success: true, message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
async function handleSendNotification(req, res) {
    try {
        const { recipientEmail, recipientId, recipientName, title, message, link, type } = req.body;
        if (!recipientId && !recipientEmail) {
            res.status(400).json({ success: false, message: 'Recipient email or ID is required.' });
            return;
        }
        let targetUserId = recipientId;
        if (!targetUserId && recipientEmail) {
            const cleanEmail = recipientEmail.toLowerCase().trim();
            let foundUser = await User_js_1.User.findOne({ email: cleanEmail });
            if (!foundUser) {
                // Auto-create client user account so notifications are persisted and ready when client registers/logs in
                const nameToUse = recipientName || cleanEmail.split('@')[0];
                foundUser = await User_js_1.User.create({
                    name: nameToUse,
                    email: cleanEmail,
                    password: `Client_${Date.now()}_AutoPass!`,
                    role: 'CLIENT'
                });
            }
            targetUserId = foundUser._id;
        }
        if (!targetUserId) {
            res.status(404).json({ success: false, message: 'Could not determine recipient user for notification.' });
            return;
        }
        // Validate and sanitize notification type
        const validTypes = [
            'NEW_LEAD',
            'VIEWING_REQUEST',
            'STATUS_CHANGE',
            'COMMISSION',
            'SYSTEM',
            'VIEWING_SCHEDULED',
            'BROKER_ASSIGNED',
            'GENERAL'
        ];
        const sanitizedType = validTypes.includes(type) ? type : 'STATUS_CHANGE';
        const notification = await Notification_js_1.Notification.create({
            recipient: targetUserId,
            title: title || 'Property Update',
            message: message || '',
            type: sanitizedType,
            link: link || '/profile',
            isRead: false
        });
        res.status(201).json({
            success: true,
            message: 'Notification transmitted successfully',
            notification
        });
    }
    catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
}
