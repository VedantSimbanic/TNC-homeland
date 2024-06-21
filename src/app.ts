import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";
import session from "express-session";
import path from "path";
import passport from "./config/passport";
import { connectToDB } from "./config/db";
import propertyRoutes from "./routers/property-router";
import agentRoutes from "./routers/agent-routers";


import { authMiddleware } from "./helpers/validation/auth-middleware";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 6006;

// Connect to MongoDB
connectToDB();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use("/api/agent", agentRoutes);
app.use("/api/property", authMiddleware, propertyRoutes);


// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
