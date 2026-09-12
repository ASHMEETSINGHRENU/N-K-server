"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSystemNotification = sendSystemNotification;
const Notification_js_1 = require("../../models/Notification.js");
async function sendSystemNotification(recipientUserId, title, message, type = 'SYSTEM', link) {
    return Notification_js_1.Notification.create({
        recipient: recipientUserId,
        title,
        message,
        type,
        link,
        isRead: false
    });
}
