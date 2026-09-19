import { Schema, model, type InferSchemaType } from 'mongoose';

export const IDEA_STATUSES = ['submitted', 'reviewed'] as const;
export type IdeaStatus = (typeof IDEA_STATUSES)[number];

const ideaSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
    productIdea: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    status: { type: String, enum: IDEA_STATUSES, default: 'submitted' },
  },
  { timestamps: true },
);

ideaSchema.index({ user: 1, createdAt: -1 });
ideaSchema.index({ status: 1, createdAt: -1 });

export type IdeaAttrs = InferSchemaType<typeof ideaSchema>;
export const Idea = model('Idea', ideaSchema);
