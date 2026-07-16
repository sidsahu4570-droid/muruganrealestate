import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId; // User to notify
  title: string;
  message: string;
  type: 'info' | 'alert' | 'lead' | 'enquiry';
  isRead: boolean;
  link?: string; // Route link to redirect to
  createdAt: Date;
}

const NotificationSchema: Schema = new Schema(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    type: { type: String, required: true, enum: ['info', 'alert', 'lead', 'enquiry'], default: 'info' },
    isRead: { type: Boolean, required: true, default: false },
    link: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
