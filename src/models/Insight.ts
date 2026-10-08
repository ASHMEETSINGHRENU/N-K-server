import mongoose, { Schema, Document } from 'mongoose';

export interface IInsightDocument extends Document {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  coverImage: string;
  author: {
    name: string;
    role: string;
    avatar?: string;
  };
  readingTimeMinutes: number;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  seo: {
    metaTitle?: string;
    metaDescription?: string;
  };
}

const InsightSchema = new Schema<IInsightDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    category: {
      type: String,
      enum: [
        'Dubai Market',
        'Investment',
        'Communities',
        'Buying Guide',
        'Renting Guide',
        'Developer Updates',
        'Property Trends',
        'Luxury Lifestyle'
      ],
      default: 'Dubai Market',
      index: true
    },
    coverImage: { type: String, required: true },
    author: {
      name: { type: String, default: 'Crestshore Research Team' },
      role: { type: String, default: 'Dubai Market Strategist' },
      avatar: { type: String }
    },
    readingTimeMinutes: { type: Number, default: 4 },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true, index: true },
    publishedAt: { type: Date, default: Date.now, index: true },
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String }
    }
  },
  { timestamps: true }
);

export const Insight = mongoose.model<IInsightDocument>('Insight', InsightSchema);
