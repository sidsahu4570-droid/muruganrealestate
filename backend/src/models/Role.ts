import mongoose, { Schema, Document } from 'mongoose';

export interface IRole extends Document {
  name: string; // "Super Admin", "Admin", "Sales Executive"
  key: string;  // "super_admin", "admin", "sales_executive"
  permissions: string[];
  description?: string;
}

const RoleSchema: Schema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    key: { type: String, required: true, unique: true },
    permissions: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<IRole>('Role', RoleSchema);
