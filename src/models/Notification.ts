import mongoose, { Schema, Document } from 'mongoose';

export interface INotificationDocument extends Document {
  recipient: mongoose.Types.ObjectId;
  title: string;
  message: string;
  type: 'NEW_LEAD' | 'VIEWING_REQUEST' | 'STATUS_CHANGE' | 'COMMISSION' | 'SYSTEM';
  link?: string;
  isRead: boolean;
}

const NotificationSchema = new Schema<INotificationDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: {
      type: String,
      enum: ['NEW_LEAD', 'VIEWING_REQUEST', 'STATUS_CHANGE', 'COMMISSION', 'SYSTEM'],
      default: 'SYSTEM'
    },
    link: { type: String },
    isRead: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Notification = mongoose.model<INotificationDocument>('Notification', NotificationSchema);
