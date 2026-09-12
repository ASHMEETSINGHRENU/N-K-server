import mongoose, { Schema, Document } from 'mongoose';

export interface ILocationDocument extends Document {
  name: string;
  slug: string;
  headline: string;
  description: string;
  image: string;
  country: string;
  isActive: boolean;
}

const LocationSchema = new Schema<ILocationDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    headline: { type: String, default: '' },
    description: { type: String, default: '' },
    image: { type: String, required: true },
    country: { type: String, default: 'United Arab Emirates' },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Location = mongoose.model<ILocationDocument>('Location', LocationSchema);
