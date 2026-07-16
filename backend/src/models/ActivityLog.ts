import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user?: mongoose.Types.ObjectId; // User executing the action
  action: string;
  details?: string;
  ipAddress?: string;
  userAgent?: string;
}

const ActivityLogSchema: Schema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    action: { type: String, required: true },
    details: { type: String },
    ipAddress: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
