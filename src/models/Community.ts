import mongoose, { Schema, Document } from 'mongoose';

export interface ICommunityDocument extends Document {
  name: string;
  slug: string;
  location: mongoose.Types.ObjectId;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  avgPricePerSqFtAED: number;
  lifestyleTags: string[];
  isFeatured: boolean;
}

const CommunitySchema = new Schema<ICommunityDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location' },
    tagline: { type: String, default: '' },
    description: { type: String, default: '' },
    coverImage: { type: String, required: true },
    gallery: [{ type: String }],
    avgPricePerSqFtAED: { type: Number, default: 3500 },
    lifestyleTags: [{ type: String }],
    isFeatured: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

export const Community = mongoose.model<ICommunityDocument>('Community', CommunitySchema);
