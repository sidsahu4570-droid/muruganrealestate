import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  name: string;
  email: string;
  phone?: string;
  source?: string;
  status: 'new' | 'contacted' | 'site_visit' | 'negotiation' | 'won' | 'lost' | 'follow_up';
  assignedTo?: mongoose.Types.ObjectId;
  notesList: Array<{
    note: string;
    author: string;
    createdAt: Date;
  }>;
  reminders: Array<{
    time: Date;
    note: string;
    isCompleted: boolean;
  }>;
  timeline: Array<{
    action: string;
    details?: string;
    createdAt?: Date;
  }>;
}

const LeadSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    source: { type: String, default: 'website' },
    status: {
      type: String,
      required: true,
      enum: ['new', 'contacted', 'site_visit', 'negotiation', 'won', 'lost', 'follow_up'],
      default: 'new',
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    notesList: [
      {
        note: { type: String, required: true },
        author: { type: String, default: 'System' },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    reminders: [
      {
        time: { type: Date, required: true },
        note: { type: String, required: true },
        isCompleted: { type: Boolean, default: false },
      },
    ],
    timeline: [
      {
        action: { type: String, required: true },
        details: { type: String },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<ILead>('Lead', LeadSchema);
