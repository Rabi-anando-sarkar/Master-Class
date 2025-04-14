import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { userRouter } from './routes/user.routes.js';
import { todoRouter } from './routes/todo.routes.js';

export const app = express();

if(!process.env.CORS_ORIGIN) {
    console.warn(`Warning: CORS_ORIGIN is not set in environment variables.`)
}

app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

app.use('/api/v1/users', userRouter)
app.use('/api/v1/todos', todoRouter)
