import mongoose from 'mongoose';

type UserTypes = {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
};

const userSchema = new mongoose.Schema({}, {});
