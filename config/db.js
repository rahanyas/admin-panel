import mongoose from "mongoose";

const url = 'mongodb://localhost:27017/crud';

export const connectDB = async () => {
  try {
     await mongoose.connect(url);
    console.log('connected to mongoDB');
  }catch(err){
  console.error('error connecting to mongoDB', err)
}
};