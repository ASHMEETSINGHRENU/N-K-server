import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadActivityDocument extends Document {
  lead: mongoose.Types.ObjectId;
  actor: string;
  type: 'STATUS_CHANGE' | 'NOTE_ADDED' | 'CALL_MADE' | 'WHATSAPP_SENT' | 'VIEWING_SCHEDULED' | 'EMAIL_SENT';
  details: string;
  previousValue?: string;
  newValue?: string;
}

const LeadActivitySchema = new Schema<ILeadActivityDocument>(
  {
    lead: { type: Schema.Types.ObjectId, ref: 'Lead', required: true, index: true },
    actor: { type: String, required: true },
    type: {
      type: String,
      enum: ['STATUS_CHANGE', 'NOTE_ADDED', 'CALL_MADE', 'WHATSAPP_SENT', 'VIEWING_SCHEDULED', 'EMAIL_SENT'],
      required: true
    },
    details: { type: String, required: true },
    previousValue: { type: String },
    newValue: { type: String }
  },
  { timestamps: true }
);

export const LeadActivity = mongoose.model<ILeadActivityDocument>('LeadActivity', LeadActivitySchema);
