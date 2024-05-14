import mongoose, { Schema } from 'mongoose';

export type CommunityTypes = {
  authorId: mongoose.Types.ObjectId;
  authorName: string;
  authorAvatar: string;
  name: string;
  avatarImg: string;
  coverImg: string;
  description: string;
  rules: string[];
  members: mongoose.Types.ObjectId[];
  moderator: mongoose.Types.ObjectId[];
};

const communitySchema = new mongoose.Schema<CommunityTypes>(
  {
    authorId: { type: Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
    authorAvatar: { type: String },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatarImg: { type: String },
    coverImg: { type: String },
    description: { type: String, trim: true },
    rules: [String],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    moderator: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
  },
  { timestamps: true }
);

export const Community = mongoose.model('Community', communitySchema);
