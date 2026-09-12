import mongoose, { Schema, Document } from 'mongoose';

export interface IViewingDocument extends Document {
  property: mongoose.Types.ObjectId;
  lead?: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  broker: mongoose.Types.ObjectId;
  viewingDate: Date;
  viewingTimeSlot: string;
  status: 'REQUESTED' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'RESCHEDULED';
  meetingPoint?: string;
  attendeesCount?: number;
  clientFeedback?: string;
  brokerNotes?: string;
}

const ViewingSchema = new Schema<IViewingDocument>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true },
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', index: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client', index: true },
    broker: { type: Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
    viewingDate: { type: Date, required: true, index: true },
    viewingTimeSlot: { type: String, required: true },
    status: {
      type: String,
      enum: ['REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'RESCHEDULED'],
      default: 'REQUESTED',
      index: true
    },
    meetingPoint: { type: String, default: 'Property Entrance / Lobby' },
    attendeesCount: { type: Number, default: 2 },
    clientFeedback: { type: String },
    brokerNotes: { type: String }
  },
  { timestamps: true }
);

export const Viewing = mongoose.model<IViewingDocument>('Viewing', ViewingSchema);
