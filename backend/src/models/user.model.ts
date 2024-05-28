import mongoose from 'mongoose';
type UserTypes = {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  following: mongoose.Types.ObjectId[];
  followers: mongoose.Types.ObjectId[];
  savedPosts: mongoose.Types.ObjectId[];
  refreshToken: string[];
};

const userSchema = new mongoose.Schema<UserTypes>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    bio: {
      type: String,
    },
    avatar: {
      type: String,
    },
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    savedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    refreshToken: [String],
  },
  { timestamps: true }
);

// userSchema.pre('save', async function (next) {
//   if (this.isModified('password')) {
//     this.password = await bcrypt.hash(this.password, 8);
//   }
//   next();
// });

const User = mongoose.model<UserTypes>('User', userSchema);

export default User;
