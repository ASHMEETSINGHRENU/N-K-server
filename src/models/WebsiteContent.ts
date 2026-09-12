import mongoose, { Schema, Document } from 'mongoose';

export interface IWebsiteContentDocument extends Document {
  hero: {
    headline: string;
    subheadline: string;
    backgroundImage: string;
    backgroundVideo?: string;
    ctaText: string;
    ctaLink: string;
  };
  featuredSectionTitle: string;
  featuredSectionSubtitle: string;
  consultationBanner: {
    title: string;
    description: string;
    buttonText: string;
    image: string;
  };
  announcementBanner?: {
    enabled: boolean;
    text: string;
    link?: string;
  };
  contactInfo: {
    phone: string;
    email: string;
    officeAddress: string;
    reraRegistrationNumber: string;
    trnNumber: string;
    operatingHours: string;
  };
  socialLinks: {
    instagram?: string;
    linkedin?: string;
    youtube?: string;
    whatsapp?: string;
  };
}

const WebsiteContentSchema = new Schema<IWebsiteContentDocument>(
  {
    hero: {
      headline: { type: String, default: 'Find Your Place in Dubai' },
      subheadline: {
        type: String,
        default: 'Curated architectural masterpieces, prime beachfront villas, and private sky penthouses for the world’s most discerning individuals.'
      },
      backgroundImage: {
        type: String,
        default: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=2000&q=85'
      },
      backgroundVideo: { type: String },
      ctaText: { type: String, default: 'Explore Prime Properties' },
      ctaLink: { type: String, default: '/properties' }
    },
    featuredSectionTitle: { type: String, default: 'Curated Luxury Residences' },
    featuredSectionSubtitle: {
      type: String,
      default: 'Handpicked prime Dubai properties offering unrivaled architectural grandeur, panoramic views, and prestigious addresses.'
    },
    consultationBanner: {
      title: { type: String, default: 'Looking for Something Truly Exceptional?' },
      description: {
        type: String,
        default: 'Our private client advisors hold exclusive off-market listings across Palm Jumeirah, Emirates Hills, and Bulgari Resort Residences.'
      },
      buttonText: { type: String, default: 'Speak With a Private Specialist' },
      image: {
        type: String,
        default: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80'
      }
    },
    announcementBanner: {
      enabled: { type: Boolean, default: false },
      text: { type: String, default: '' },
      link: { type: String }
    },
    contactInfo: {
      phone: { type: String, default: '+971 4 456 7890' },
      email: { type: String, default: 'private@nestandkey.com' },
      officeAddress: { type: String, default: 'Level 42, ICD Brookfield Place, DIFC, Dubai, United Arab Emirates' },
      reraRegistrationNumber: { type: String, default: 'RERA ORN 28941' },
      trnNumber: { type: String, default: '100293848100003' },
      operatingHours: { type: String, default: 'Monday – Saturday: 09:00 AM – 08:00 PM GST' }
    },
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com' },
      linkedin: { type: String, default: 'https://linkedin.com' },
      youtube: { type: String, default: 'https://youtube.com' },
      whatsapp: { type: String, default: 'https://wa.me/971501234567' }
    }
  },
  { timestamps: true }
);

export const WebsiteContent = mongoose.model<IWebsiteContentDocument>('WebsiteContent', WebsiteContentSchema);
