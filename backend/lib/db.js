import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

export const connectDB = async () => {
    try {
        const mongoURL = process.env.MONGO_URL;

        if (!mongoURL) {
            throw new Error("MONGO_URL environment variable is not defined.");
        }

        const connection = await mongoose.connect(mongoURL);

        console.log(`✅ MongoDB connected: ${connection.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};
