import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    authorName: { type: String },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    reply: [{ type: String }],
  },
  {
    timestamps: true,
  }
);

export const Comment = mongoose.model('Comment', CommentSchema);
