import mongoose, { Schema, Document } from 'mongoose';

export interface ISavedSearchDocument extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  filters: Record<string, any>;
  notifyEmail: boolean;
}

const SavedSearchSchema = new Schema<ISavedSearchDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    filters: { type: Schema.Types.Mixed, default: {} },
    notifyEmail: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const SavedSearch = mongoose.model<ISavedSearchDocument>('SavedSearch', SavedSearchSchema);
