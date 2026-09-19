import { Schema, model, type InferSchemaType } from 'mongoose';

const adminUserSchema = new Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 },
    passwordHash: { type: String, required: true, select: false },
  },
  { timestamps: true },
);

export type AdminUserAttrs = InferSchemaType<typeof adminUserSchema>;
export const AdminUser = model('AdminUser', adminUserSchema, 'adminusers');
