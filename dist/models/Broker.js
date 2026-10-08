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
exports.Broker = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const BrokerSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reraNumber: { type: String, required: true, unique: true, trim: true, index: true },
    brn: { type: String, required: true, trim: true },
    agencyName: { type: String, default: 'Crestshore Luxury Real Estate LLC' },
    title: { type: String, default: 'Private Client Advisor' },
    photoUrl: { type: String, required: true },
    bio: { type: String, default: '' },
    languages: [{ type: String }],
    specializations: [{ type: String }],
    experienceYears: { type: Number, default: 5 },
    totalSalesVolumeAED: { type: Number, default: 0 },
    commissionSplitPct: { type: Number, default: 60 }, // 60% broker / 40% firm
    activeListingsCount: { type: Number, default: 0 },
    rating: { type: Number, default: 4.9 },
    reviewsCount: { type: Number, default: 12 },
    isVerified: { type: Boolean, default: true },
    isActive: { type: Boolean, default: true, index: true },
    whatsappNumber: { type: String }
}, { timestamps: true });
exports.Broker = mongoose_1.default.model('Broker', BrokerSchema);
