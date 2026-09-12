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
exports.Commission = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const CommissionSchema = new mongoose_1.Schema({
    transactionId: { type: String, required: true, unique: true, index: true },
    property: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Property', required: true },
    broker: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
    client: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Client' },
    salePriceAED: { type: Number, required: true },
    grossCommissionPct: { type: Number, default: 2.0 },
    grossCommissionAED: { type: Number, required: true },
    brokerSplitPct: { type: Number, default: 60.0 },
    netBrokerCommissionAED: { type: Number, required: true },
    companyCommissionAED: { type: Number, required: true },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'PAID', 'DISPUTED'],
        default: 'PENDING',
        index: true
    },
    closedDate: { type: Date, default: Date.now, index: true },
    paidDate: { type: Date },
    notes: { type: String }
}, { timestamps: true });
exports.Commission = mongoose_1.default.model('Commission', CommissionSchema);
