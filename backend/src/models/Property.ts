import mongoose, { Schema, Document } from 'mongoose';

export interface IProperty extends Document {
  title: string;
  slug: string;
  price: number;
  offerPrice?: number;
  description: string;
  shortDescription?: string;
  status: 'available' | 'sold' | 'upcoming' | 'featured' | 'premium' | 'trending';
  listingType: 'sale' | 'rent';
  category: mongoose.Types.ObjectId;
  city: mongoose.Types.ObjectId;
  location: mongoose.Types.ObjectId;
  state?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  features: string[];
  propertyFeatures?: string[];
  amenities?: string[];
  nearbyPlaces?: Array<{
    name: string;
    distance: string;
    type: string;
  }>;
  propertyDocuments?: string[];
  floorPlans?: Array<{
    name: string;
    image: string;
  }>;
  tour360?: string;
  videoUrl?: string;
  featuredImage?: string;
  galleryImages?: string[];
  images: string[];
  agent: mongoose.Types.ObjectId;
  specs: {
    beds?: number;
    baths?: number;
    area?: number; // in sq ft
    yearBuilt?: number;
    balcony?: number;
    kitchen?: number;
    parking?: number;
    floor?: number;
    facing?: string;
    age?: number;
  };
  seo?: {
    title?: string;
    description?: string;
    schema?: string;
  };
}

const PropertySchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    shortDescription: { type: String },
    price: { type: Number, required: true },
    offerPrice: { type: Number },
    status: {
      type: String,
      required: true,
      enum: ['available', 'sold', 'upcoming', 'featured', 'premium', 'trending'],
      default: 'available',
    },
    listingType: { type: String, required: true, enum: ['sale', 'rent'] },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    city: { type: Schema.Types.ObjectId, ref: 'City', required: true },
    location: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
    state: { type: String, default: 'NY' },
    country: { type: String, default: 'US' },
    coordinates: {
      lat: { type: Number, default: 40.7128 },
      lng: { type: Number, default: -74.0060 },
    },
    features: [{ type: String }],
    propertyFeatures: [{ type: String }],
    amenities: [{ type: String }],
    nearbyPlaces: [
      {
        name: { type: String },
        distance: { type: String },
        type: { type: String },
      },
    ],
    propertyDocuments: [{ type: String }],
    floorPlans: [
      {
        name: { type: String },
        image: { type: String },
      },
    ],
    tour365: { type: String },
    videoUrl: { type: String },
    featuredImage: { type: String },
    galleryImages: [{ type: String }],
    images: [{ type: String }],
    agent: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    specs: {
      beds: { type: Number },
      baths: { type: Number },
      area: { type: Number },
      yearBuilt: { type: Number },
      balcony: { type: Number, default: 0 },
      kitchen: { type: Number, default: 1 },
      parking: { type: Number, default: 0 },
      floor: { type: Number, default: 1 },
      facing: { type: String, default: 'North' },
      age: { type: Number, default: 0 },
    },
    seo: {
      title: { type: String },
      description: { type: String },
      schema: { type: String },
    },
  },
  { timestamps: true }
);

export default mongoose.model<IProperty>('Property', PropertySchema);
