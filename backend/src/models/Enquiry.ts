import mongoose, { Schema, Document } from 'mongoose';

export interface IEnquiry extends Document {
  name: string;
  email: string;
  phone?: string;
  property?: mongoose.Types.ObjectId;
  message: string;
  status: 'new' | 'in_progress' | 'replied' | 'resolved';
  assignedTo?: mongoose.Types.ObjectId;
  replies: Array<{
    message: string;
    senderName: string;
    createdAt: Date;
  }>;
}

const EnquirySchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    message: { type: String, required: true },
    status: {
      type: String,
      required: true,
      enum: ['new', 'in_progress', 'replied', 'resolved'],
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    replies: [
      {
        message: { type: String, required: true },
        senderName: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IEnquiry>('Enquiry', EnquirySchema);
