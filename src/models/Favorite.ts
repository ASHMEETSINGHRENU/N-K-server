import mongoose, { Schema, Document } from 'mongoose';

export interface IFavoriteDocument extends Document {
  user: mongoose.Types.ObjectId;
  property: mongoose.Types.ObjectId;
}

const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true, index: true }
  },
  { timestamps: true }
);

FavoriteSchema.index({ user: 1, property: 1 }, { unique: true });

export const Favorite = mongoose.model<IFavoriteDocument>('Favorite', FavoriteSchema);
