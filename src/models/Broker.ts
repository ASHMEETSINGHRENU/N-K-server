import mongoose, { Schema, Document } from 'mongoose';

export interface IBrokerDocument extends Document {
  user: mongoose.Types.ObjectId;
  reraNumber: string;
  brn: string;
  agencyName: string;
  title: string;
  photoUrl: string;
  bio: string;
  languages: string[];
  specializations: string[];
  experienceYears: number;
  totalSalesVolumeAED: number;
  commissionSplitPct: number;
  activeListingsCount: number;
  rating: number;
  reviewsCount: number;
  isVerified: boolean;
  isActive: boolean;
  whatsappNumber?: string;
}

const BrokerSchema = new Schema<IBrokerDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reraNumber: { type: String, required: true, unique: true, trim: true, index: true },
    brn: { type: String, required: true, trim: true },
    agencyName: { type: String, default: 'Crestshore Luxury Real Estate LLC' },
    title: { type: String, default: 'Private Client Advisor' },
    photoUrl: { type: String, required: true },
    bio: { type: String, default: '' },
    languages: [{ type: String }],
    specializations: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    totalSalesVolumeAED: { type: Number, default: 0 },
    commissionSplitPct: { type: Number, default: 60 }, // 60% broker / 40% firm
    activeListingsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 12 },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    whatsappNumber: { type: String }
  },
  { timestamps: true }
);

export const Broker = mongoose.model<IBrokerDocument>('Broker', BrokerSchema);
