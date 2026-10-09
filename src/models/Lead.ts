import mongoose, { Schema, Document } from 'mongoose';

export interface ILeadDocument extends Document {
  leadId: string;
  name: string;
  email: string;
  mobile: string;
  preferredContactMethod: 'PHONE' | 'WHATSAPP' | 'EMAIL';
  property?: mongoose.Types.ObjectId;
  broker?: mongoose.Types.ObjectId;
  source: 'WEBSITE' | 'GOOGLE' | 'INSTAGRAM' | 'FACEBOOK' | 'YOUTUBE' | 'REFERRAL' | 'DIRECT' | 'CAMPAIGN' | 'OTHER';
  campaign?: string;
  leadType: 'INQUIRY' | 'VIEWING_REQUEST' | 'SPECIALIST_CALL' | 'CONSULTATION' | 'VALUATION';
  message: string;
  status: 'NEW' | 'CONTACTED' | 'QUALIFIED' | 'VIEWING' | 'NEGOTIATION' | 'CONVERTED' | 'LOST';
  estimatedBudgetAED?: number;
  isAnonymous?: boolean;
  assignedRM?: string;
  projectName?: string;
  notes: Array<{
    author: string;
    text: string;
    createdAt: Date;
  }>;
  followUpDate?: Date;
  lastActivity: Date;
}

const LeadSchema = new Schema<ILeadDocument>(
  {
    leadId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    mobile: { type: String, required: true, trim: true },
    isAnonymous: { type: Boolean, default: false },
    assignedRM: { type: String, default: 'Tariq Al-Mansoor (Principal RM)' },
    projectName: { type: String },
    preferredContactMethod: {
      type: String,
      enum: ['PHONE', 'WHATSAPP', 'EMAIL'],
      default: 'WHATSAPP'
    },
    property: { type: Schema.Types.ObjectId, ref: 'Property', index: true },
    broker: { type: Schema.Types.ObjectId, ref: 'Broker', index: true },
    source: {
      type: String,
      enum: ['WEBSITE', 'GOOGLE', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'REFERRAL', 'DIRECT', 'CAMPAIGN', 'OTHER'],
      default: 'WEBSITE',
      index: true
    },
    campaign: { type: String },
    leadType: {
      type: String,
      enum: ['INQUIRY', 'VIEWING_REQUEST', 'SPECIALIST_CALL', 'CONSULTATION', 'VALUATION'],
      default: 'INQUIRY'
    },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED', 'LOST'],
      default: 'NEW',
      index: true
    },
    estimatedBudgetAED: { type: Number },
    notes: [
      {
        author: { type: String, required: true },
        text: { type: String, required: true },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    followUpDate: { type: Date },
    lastActivity: { type: Date, default: Date.now, index: true }
  },
  { timestamps: true }
);

LeadSchema.index({ broker: 1, status: 1 });
LeadSchema.index({ createdAt: -1 });

export const Lead = mongoose.model<ILeadDocument>('Lead', LeadSchema);
