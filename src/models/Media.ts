import mongoose, { Schema, Document } from 'mongoose';

export interface IMediaDocument extends Document {
  filename: string;
  url: string;
  publicId?: string;
  mimeType: string;
  sizeBytes: number;
  altText?: string;
  uploadedBy?: mongoose.Types.ObjectId;
}

const MediaSchema = new Schema<IMediaDocument>(
  {
    filename: { type: String, required: true },
    url: { type: String, required: true },
    publicId: { type: String },
    mimeType: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
    altText: { type: String, default: '' },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export const Media = mongoose.model<IMediaDocument>('Media', MediaSchema);
