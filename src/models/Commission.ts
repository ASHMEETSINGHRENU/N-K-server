import mongoose, { Schema, Document } from 'mongoose';

export interface ICommissionDocument extends Document {
  transactionId: string;
  property: mongoose.Types.ObjectId;
  broker: mongoose.Types.ObjectId;
  client?: mongoose.Types.ObjectId;
  salePriceAED: number;
  grossCommissionPct: number;
  grossCommissionAED: number;
  brokerSplitPct: number;
  netBrokerCommissionAED: number;
  companyCommissionAED: number;
  status: 'PENDING' | 'APPROVED' | 'PAID' | 'DISPUTED';
  closedDate: Date;
  paidDate?: Date;
  notes?: string;
}

const CommissionSchema = new Schema<ICommissionDocument>(
  {
    transactionId: { type: String, required: true, unique: true, index: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    broker: { type: Schema.Types.ObjectId, ref: 'Broker', required: true, index: true },
    client: { type: Schema.Types.ObjectId, ref: 'Client' },
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
  },
  { timestamps: true }
);

export const Commission = mongoose.model<ICommissionDocument>('Commission', CommissionSchema);
