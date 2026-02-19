// src/app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route";
import linkRoutes from "./modules/link/link.route";
import errorMiddleware from "./middleware/error.middleware";
import { authRateLimiter } from "./middleware/rateLimiter.middleware";
import { apiRateLimiter } from "./middleware/rateLimiter.middleware";

const app = express();

/* =======================
   GLOBAL MIDDLEWARE
======================= */

app.use(helmet());
app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // frontend URL
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

/* =======================
   ROUTES
======================= */

app.get("/", (req, res) => {
  res.send("URL Shortener API running 🚀");
});

app.use("/api/auth", authRateLimiter, authRoutes);
app.use("/api/link", apiRateLimiter, linkRoutes);
app.use(errorMiddleware); // Global error handler (LAST)

/* =======================
   ERROR HANDLER (LAST)
======================= */

export default app;
