import dotenv from "dotenv"
import { connectToDB } from './config/db'
import { app } from "./app"
import path from 'path';

console.log('Current working directory:', process.cwd());

dotenv.config({
    path: path.resolve(__dirname, '../.env')
});

if(!process.env.PORT) {
    console.log(`PORT not set in environment variables.`)
}

const startServer = async (): Promise<void> => {
    try {
        await connectToDB()
        console.log("MongoDB connected successfully");

        const PORT = process.env.PORT || 8000

        app.on("error", (error) => {
            console.error("Express App Error:", error);
            process.exit(1)
        })
        
        app.listen(PORT, () => {
            console.log(`Server is running on port: ${PORT}`);
        })

    } catch (error) {
        console.error("MongoDB Connection Failed:", error)
        process.exit(1);
    }
}

startServer();