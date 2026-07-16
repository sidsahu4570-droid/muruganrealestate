import mongoose, { Schema, Document } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  slug: string;
  content: string;
  author: mongoose.Types.ObjectId;
  status: 'draft' | 'published';
  tags: string[];
  coverImage?: string;
}

const BlogSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, required: true, enum: ['draft', 'published'], default: 'draft' },
    tags: [{ type: String }],
    coverImage: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', BlogSchema);
