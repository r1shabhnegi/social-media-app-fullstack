import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  upVotes: { type: Number, default: 0 },
  downVotes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
