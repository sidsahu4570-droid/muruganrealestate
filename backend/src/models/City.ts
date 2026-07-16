import mongoose, { Schema, Document } from 'mongoose';

export interface ICity extends Document {
  name: string;
  slug: string;
  state?: string;
  country?: string;
  image?: string;
}

const CitySchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    state: { type: String },
    country: { type: String, default: 'US' },
    image: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<ICity>('City', CitySchema);
