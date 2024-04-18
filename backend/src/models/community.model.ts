import mongoose, { Schema } from 'mongoose';

export type CommunityTypes = {
  author: mongoose.Types.ObjectId;
  name: string;
  avatar: string;
  coverImage: string;
  description: string;
  rules: string[];
  members: mongoose.Types.ObjectId[];
  moderator: mongoose.Types.ObjectId[];
  posts: mongoose.Types.ObjectId[];
};

const communitySchema = new mongoose.Schema<CommunityTypes>(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    name: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
    },
    avatar: {
      type: String,
    },
    coverImage: {
      type: String,
    },

    description: {
      type: String,
      trim: true,
    },
    rules: [String],
    members: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    moderator: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: [] }],
  },
  { timestamps: true }
);

export const Community = mongoose.model('Community', communitySchema);
