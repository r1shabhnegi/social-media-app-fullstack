import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
    upVotes: { type: Number, default: 0 },
    downVotes: { type: Number, default: 0 },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  },
  { timestamps: true }
);

export const Post = mongoose.model('Post', postSchema);
