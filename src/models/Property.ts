import mongoose, { Schema, Document } from 'mongoose';

export interface IPropertyDocument extends Document {
  title: string;
  slug: string;
  referenceNumber: string;
  description: string;
  purpose: 'BUY' | 'RENT' | 'OFF_PLAN';
  propertyType: string;
  category?: mongoose.Types.ObjectId;
  priceAED: number;
  rentalFrequency?: 'YEARLY' | 'MONTHLY' | 'WEEKLY' | 'DAILY';
  serviceChargesAED?: number;
  bedrooms: number;
  bathrooms: number;
  builtUpAreaSqFt: number;
  plotAreaSqFt?: number;
  location: string;
  community: string;
  subCommunity?: string;
  developer?: string;
  project?: string;
  furnishing: 'UNFURNISHED' | 'SEMI_FURNISHED' | 'FURNISHED' | 'DESIGNER_FURNISHED';
  completionStatus: 'READY' | 'OFF_PLAN' | 'UNDER_CONSTRUCTION';
  handoverDate?: string;
  paymentPlan?: {
    downPaymentPct: number;
    duringConstructionPct: number;
    onHandoverPct: number;
    postHandoverPct?: number;
  };
  amenities: string[];
  images: string[];
  featuredImage: string;
  videoUrl?: string;
  virtualTourUrl?: string;
  floorPlans: Array<{
    title: string;
    bedrooms: number;
    bathrooms: number;
    totalAreaSqFt: number;
    imageUrl: string;
  }>;
  nearbyPlaces: Array<{
    name: string;
    category: string;
    distanceMinutes: number;
  }>;
  assignedBroker: mongoose.Types.ObjectId;
  status: 'DRAFT' | 'PENDING_APPROVAL' | 'ACTIVE' | 'INACTIVE' | 'SOLD' | 'RENTED';
  isFeatured: boolean;
  isNewLaunch: boolean;
  luxuryCollection?: string;
  views: string[];
  seo: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string[];
  };
}

const PropertySchema = new Schema<IPropertyDocument>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    referenceNumber: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    purpose: { type: String, enum: ['BUY', 'RENT', 'OFF_PLAN'], required: true, index: true },
    propertyType: { type: String, required: true, index: true },
    category: { type: Schema.Types.ObjectId, ref: 'PropertyCategory' },
    priceAED: { type: Number, required: true, index: true },
    rentalFrequency: { type: String, enum: ['YEARLY', 'MONTHLY', 'WEEKLY', 'DAILY'], default: 'YEARLY' },
    serviceChargesAED: { type: Number },
    bedrooms: { type: Number, required: true, index: true },
    bathrooms: { type: Number, required: true },
    builtUpAreaSqFt: { type: Number, required: true, index: true },
    plotAreaSqFt: { type: Number },
    location: { type: String, default: 'Dubai', index: true },
    community: { type: String, required: true, index: true },
    subCommunity: { type: String },
    developer: { type: String, index: true },
    project: { type: String },
    furnishing: {
      type: String,
      enum: ['UNFURNISHED', 'SEMI_FURNISHED', 'FURNISHED', 'DESIGNER_FURNISHED'],
      default: 'DESIGNER_FURNISHED'
    },
    completionStatus: {
      type: String,
      enum: ['READY', 'OFF_PLAN', 'UNDER_CONSTRUCTION'],
      default: 'READY',
      index: true
    },
    handoverDate: { type: String },
    paymentPlan: {
      downPaymentPct: { type: Number },
      duringConstructionPct: { type: Number },
      onHandoverPct: { type: Number },
      postHandoverPct: { type: Number }
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    featuredImage: { type: String, required: true },
    videoUrl: { type: String },
    virtualTourUrl: { type: String },
    floorPlans: [
      {
        title: { type: String },
        bedrooms: { type: Number },
        bathrooms: { type: Number },
        totalAreaSqFt: { type: Number },
        imageUrl: { type: String }
      }
    ],
    nearbyPlaces: [
      {
        name: { type: String },
        category: { type: String },
        distanceMinutes: { type: Number }
      }
    ],
    assignedBroker: { type: Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
    status: {
      type: String,
      enum: ['DRAFT', 'PENDING_APPROVAL', 'ACTIVE', 'INACTIVE', 'SOLD', 'RENTED'],
      default: 'ACTIVE',
      index: true
    },
    isFeatured: { type: Boolean, default: false, index: true },
    isNewLaunch: { type: Boolean, default: false, index: true },
    luxuryCollection: { type: String, index: true },
    views: [{ type: String }],
    seo: {
      metaTitle: { type: String },
      metaDescription: { type: String },
      keywords: [{ type: String }]
    }
  },
  { timestamps: true }
);

// Compound indexes for rapid luxury property search queries
PropertySchema.index({ status: 1, purpose: 1, community: 1 });
PropertySchema.index({ status: 1, isFeatured: 1 });
PropertySchema.index({ status: 1, priceAED: 1 });
PropertySchema.index({ status: 1, bedrooms: 1 });

export const Property = mongoose.model<IPropertyDocument>('Property', PropertySchema);
