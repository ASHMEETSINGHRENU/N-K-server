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
exports.Property = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const PropertySchema = new mongoose_1.Schema({
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, trim: true },
    referenceNumber: { type: String, required: true, unique: true, index: true },
    description: { type: String, required: true },
    purpose: { type: String, enum: ['BUY', 'RENT', 'OFF_PLAN'], required: true, index: true },
    propertyType: { type: String, required: true, index: true },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'PropertyCategory' },
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
    assignedBroker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
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
}, { timestamps: true });
// Compound indexes for rapid luxury property search queries
PropertySchema.index({ status: 1, purpose: 1, community: 1 });
PropertySchema.index({ status: 1, isFeatured: 1 });
PropertySchema.index({ status: 1, priceAED: 1 });
PropertySchema.index({ status: 1, bedrooms: 1 });
exports.Property = mongoose_1.default.model('Property', PropertySchema);
