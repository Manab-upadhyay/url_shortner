// src/app.ts

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import authRoutes from "./modules/auth/auth.route";
import errorMiddleware from "./middleware/error.middleware";

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

app.use("/api/auth", authRoutes);
app.use(errorMiddleware); // Global error handler (LAST)

/* =======================
   ERROR HANDLER (LAST)
======================= */

export default app;
