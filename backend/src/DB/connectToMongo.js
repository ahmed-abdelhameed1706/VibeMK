import mongoose from "mongoose";

export const connectToMongo = async () => {
  console.log("Connecting to MongoDB...");
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.log("Error in connecting to MongoDB: ", error);
    process.exit(1);
  }
};
