"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsiteContent = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const WebsiteContentSchema = new mongoose_1.Schema({
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
        email: { type: String, default: 'private@crestshore.com' },
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
}, { timestamps: true });
exports.WebsiteContent = mongoose_1.default.model('WebsiteContent', WebsiteContentSchema);
