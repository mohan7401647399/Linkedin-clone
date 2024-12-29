import express from "express";
import dotenv from "dotenv"
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.route.js"
import connectionRoutes from "./routes/connection.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors"

//  dotenv config
dotenv.config()

//  express server
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors( {
    origin: process.env.CLIENT_URL,
    // origin: "http://localhost:5173",
    credentials: true,
}))

// parse JSON request body
app.use(express.json({limit: "5mb"}))
    .use(cookieParser());               //  cookie parser

//  all routes
app.use('/api/v1/auth', authRoutes)                         //  auth routes
    .use('/api/v1/users', userRoutes)                       //  users routes
    .use('/api/v1/posts', postRoutes)                       //  posts routes
    .use('/api/v1/notifications', notificationRoutes)       //  notification routes
    .use('/api/v1/connections', connectionRoutes)           //  connection routes
 
// app connection with server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});