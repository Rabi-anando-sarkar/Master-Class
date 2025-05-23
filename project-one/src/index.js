import dotenv from "dotenv"
dotenv.config({
    path: '.env'
})

import { connectToDB } from './config/db.js'
import { app } from "./app.js"

if(!process.env.PORT) {
    console.log(`PORT not set in environment variables.`)
}

const startServer = async () => {
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