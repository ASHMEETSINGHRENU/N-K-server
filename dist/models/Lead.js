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
exports.Lead = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const LeadSchema = new mongoose_1.Schema({
    leadId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true, index: true },
    mobile: { type: String, required: true, trim: true },
    preferredContactMethod: {
        type: String,
        enum: ['PHONE', 'WHATSAPP', 'EMAIL'],
        default: 'WHATSAPP'
    },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property', index: true },
    broker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Broker', index: true },
    source: {
        type: String,
        enum: ['WEBSITE', 'GOOGLE', 'INSTAGRAM', 'FACEBOOK', 'YOUTUBE', 'REFERRAL', 'DIRECT', 'CAMPAIGN', 'OTHER'],
        default: 'WEBSITE',
        index: true
    },
    campaign: { type: String },
    leadType: {
        type: String,
        enum: ['INQUIRY', 'VIEWING_REQUEST', 'SPECIALIST_CALL', 'CONSULTATION', 'VALUATION'],
        default: 'INQUIRY'
    },
    message: { type: String, default: '' },
    status: {
        type: String,
        enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'VIEWING', 'NEGOTIATION', 'CONVERTED', 'LOST'],
        default: 'NEW',
        index: true
    },
    estimatedBudgetAED: { type: Number },
    notes: [
        {
            author: { type: String, required: true },
            text: { type: String, required: true },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    followUpDate: { type: Date },
    lastActivity: { type: Date, default: Date.now, index: true }
}, { timestamps: true });
LeadSchema.index({ broker: 1, status: 1 });
LeadSchema.index({ createdAt: -1 });
exports.Lead = mongoose_1.default.model('Lead', LeadSchema);
