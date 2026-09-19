import { Schema, model, type InferSchemaType } from 'mongoose';

export const QUERY_STATUSES = ['pending', 'resolved'] as const;
export type QueryStatus = (typeof QUERY_STATUSES)[number];

const querySchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    query: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: QUERY_STATUSES, default: 'pending' },
  },
  { timestamps: true },
);

querySchema.index({ user: 1, createdAt: -1 });
querySchema.index({ status: 1, createdAt: -1 });

export type QueryAttrs = InferSchemaType<typeof querySchema>;
// Collection named "queries"; model named CustomerQuery to avoid clashing with mongoose.Query
export const CustomerQuery = model('Query', querySchema, 'queries');
