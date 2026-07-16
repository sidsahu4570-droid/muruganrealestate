import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
  siteName: string;
  siteLogo?: string;
  favicon?: string;
  contactEmail?: string;
  contactPhone?: string;
  whatsappNumber?: string;
  googleAnalytics?: string;
  googleTagManager?: string;
  socialLinks?: {
    facebook?: string;
    twitter?: string;
    instagram?: string;
    linkedin?: string;
  };
  emailSettings?: {
    host?: string;
    port?: number;
    user?: string;
    pass?: string;
    from?: string;
  };
  footerSettings?: {
    copyright?: string;
    text?: string;
  };
  metaTitle?: string;
  metaDescription?: string;
  themeSettings?: {
    primaryColor?: string;
    secondaryColor?: string;
    accentColor?: string;
  };
}

const SettingsSchema: Schema = new Schema(
  {
    siteName: { type: String, required: true, default: 'Enterprise Real Estate' },
    siteLogo: { type: String },
    favicon: { type: String },
    contactEmail: { type: String },
    contactPhone: { type: String },
    whatsappNumber: { type: String },
    googleAnalytics: { type: String },
    googleTagManager: { type: String },
    socialLinks: {
      facebook: { type: String },
      twitter: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
    },
    emailSettings: {
      host: { type: String },
      port: { type: Number },
      user: { type: String },
      pass: { type: String },
      from: { type: String },
    },
    footerSettings: {
      copyright: { type: String },
      text: { type: String },
    },
    metaTitle: { type: String },
    metaDescription: { type: String },
    themeSettings: {
      primaryColor: { type: String, default: '#0F172A' },
      secondaryColor: { type: String, default: '#1E293B' },
      accentColor: { type: String, default: '#C9A227' },
    },
  },
  { timestamps: true }
);

export default mongoose.model<ISettings>('Settings', SettingsSchema);
