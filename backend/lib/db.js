import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const connection =  await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
    } catch (error) {
        console.log(`Error connection to MongoDB: ${error.message}`);
        process.exit(1);
    }
};