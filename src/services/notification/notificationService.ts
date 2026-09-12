import { Notification } from '../../models/Notification.js';

export async function sendSystemNotification(
  recipientUserId: string,
  title: string,
  message: string,
  type: 'NEW_LEAD' | 'VIEWING_REQUEST' | 'STATUS_CHANGE' | 'COMMISSION' | 'SYSTEM' = 'SYSTEM',
  link?: string
) {
  return Notification.create({
    recipient: recipientUserId,
    title,
    message,
    type,
    link,
    isRead: false
  });
}
