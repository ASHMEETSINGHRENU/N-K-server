import mongoose, { Schema, Document } from 'mongoose';

export interface IDeveloperDocument extends Document {
  name: string;
  slug: string;
  logo: string;
  coverImage: string;
  description: string;
  establishedYear: number;
  flagshipProjects: string[];
  isVerified: boolean;
}

const DeveloperSchema = new Schema<IDeveloperDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    logo: { type: String, default: '' },
    coverImage: { type: String, required: true },
    description: { type: String, default: '' },
    establishedYear: { type: Number },
    flagshipProjects: [{ type: String }],
    isVerified: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const Developer = mongoose.model<IDeveloperDocument>('Developer', DeveloperSchema);
