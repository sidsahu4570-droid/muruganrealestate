import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  slug: string;
  city: mongoose.Types.ObjectId;
  zipCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

const LocationSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    zipCode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ILocation>('Location', LocationSchema);
