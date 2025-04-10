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
import Path from "path"

//  dotenv config
dotenv.config()

//  express server
const app = express();
const PORT = process.env.PORT || 5000;
const __dirname = Path.resolve()

if (process.env.NODE_ENV !== "production") {
    app.use(
        cors({
            origin: "http://localhost:5173",
            credentials: true,
        })
    );
}

// parse JSON request body
app.use(express.json({ limit: "5mb" }))
    .use(cookieParser());               //  cookie parser

//  all routes
app.use('/api/v1/auth', authRoutes)                         //  auth routes
    .use('/api/v1/users', userRoutes)                       //  users routes
    .use('/api/v1/posts', postRoutes)                       //  posts routes
    .use('/api/v1/notifications', notificationRoutes)       //  notification routes
    .use('/api/v1/connections', connectionRoutes)           //  connection routes

if (process.env.NODE_ENV === "production") {
    app.use(express.static(Path.join(__dirname, "/frontend/dist")))
    app.get("*", (req, res) => {
        res.sendFile(Path.resolve(__dirname, "frontend", "dist", "index.html"))
    })
}


// app connection with server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB()
});