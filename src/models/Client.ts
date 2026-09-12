import mongoose, { Schema, Document } from 'mongoose';

export interface IClientDocument extends Document {
  user?: mongoose.Types.ObjectId;
  name: string;
  email: string;
  mobile: string;
  nationality?: string;
  residenceCountry?: string;
  buyingIntent: 'BUY' | 'RENT' | 'INVEST' | 'OFF_PLAN';
  budgetMinAED: number;
  budgetMaxAED: number;
  preferredLocations: string[];
  preferredBedrooms: number[];
  assignedBroker?: mongoose.Types.ObjectId;
  notes: string;
  tags: string[];
}

const ClientSchema = new Schema<IClientDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, index: true },
    mobile: { type: String, required: true, trim: true },
    nationality: { type: String },
    residenceCountry: { type: String, default: 'United Arab Emirates' },
    buyingIntent: { type: String, enum: ['BUY', 'RENT', 'INVEST', 'OFF_PLAN'], default: 'BUY' },
    budgetMinAED: { type: Number, default: 0 },
    budgetMaxAED: { type: Number, default: 0 },
    preferredLocations: [{ type: String }],
    preferredBedrooms: [{ type: Number }],
    assignedBroker: { type: Schema.Types.ObjectId, ref: 'Broker', index: true },
    notes: { type: String, default: '' },
    tags: [{ type: String }]
  },
  { timestamps: true }
);

export const Client = mongoose.model<IClientDocument>('Client', ClientSchema);
