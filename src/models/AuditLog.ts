import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLogDocument extends Document {
  action: string;
  performedBy: string;
  userEmail?: string;
  userRole?: string;
  ipAddress?: string;
  userAgent?: string;
  targetModel: string;
  targetId?: string;
  details?: Record<string, any>;
}

const AuditLogSchema = new Schema<IAuditLogDocument>(
  {
    action: { type: String, required: true, index: true },
    performedBy: { type: String, required: true },
    userEmail: { type: String },
    userRole: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
    targetModel: { type: String, required: true, index: true },
    targetId: { type: String },
    details: { type: Schema.Types.Mixed }
  },
  { timestamps: true }
);

AuditLogSchema.index({ createdAt: -1 });

export const AuditLog = mongoose.model<IAuditLogDocument>('AuditLog', AuditLogSchema);
