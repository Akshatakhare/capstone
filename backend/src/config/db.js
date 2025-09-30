import mongoose from 'mongoose';

export const connectDB = async (uri) => {
  return mongoose.connect(uri);
};
