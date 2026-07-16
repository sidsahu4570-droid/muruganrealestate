import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial extends Document {
  clientName: string;
  clientRole?: string;
  clientCompany?: string;
  clientImage?: string;
  rating: number;
  feedback: string;
  status: 'draft' | 'published';
}

const TestimonialSchema: Schema = new Schema(
  {
    clientName: { type: String, required: true },
    clientRole: { type: String },
    clientCompany: { type: String },
    clientImage: { type: String },
    rating: { type: Number, required: true, min: 1, max: 5, default: 5 },
    feedback: { type: String, required: true },
    status: { type: String, required: true, enum: ['draft', 'published'], default: 'draft' },
  },
  { timestamps: true }
);

export default mongoose.model<ITestimonial>('Testimonial', TestimonialSchema);
