import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyCategoryDocument extends Document {
  name: string;
  slug: string;
  description: string;
  icon?: string;
  isActive: boolean;
}

const PropertyCategorySchema = new Schema<IPropertyCategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    icon: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const PropertyCategory = mongoose.model<IPropertyCategoryDocument>('PropertyCategory', PropertyCategorySchema);
