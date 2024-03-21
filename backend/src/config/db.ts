import mongoose from 'mongoose';

export const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_CONNECTION_STRING as string);
  } catch (error) {
    console.log('DB ERROR ', error);
  }
};
