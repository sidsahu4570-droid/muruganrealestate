import mongoose, { Schema, Document } from 'mongoose';

export interface IGallery extends Document {
  title: string;
  imageUrl: string;
  category?: string; // e.g. "interior", "exterior", "neighborhood"
  status: 'active' | 'inactive';
}

const GallerySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    imageUrl: { type: String, required: true },
    category: { type: String, default: 'general' },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
  },
  { timestamps: true }
);

export default mongoose.model<IGallery>('Gallery', GallerySchema);
