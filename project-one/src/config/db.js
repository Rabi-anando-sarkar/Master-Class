import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

if(!process.env.MONGODB_URI || !DB_NAME) {
    console.log(`MONGODB_URI or DB_NAME not set in environment variables.`);
    process.exit(1)
}

export const connectToDB = async () => {
    try {
        const uri = `${process.env.MONGODB_URI}/${DB_NAME}`
        await mongoose.connect(uri);
        console.log("MongoDB connected successfully");
    } catch (error) {
        console.log(`mongo db connection failed`);
        process.exit(1)
    }
}

process.on("SIGINT", async () => {
    console.log("Gracefully shutting down...");
    await mongoose.connection.close()
    process.exit(0)
})