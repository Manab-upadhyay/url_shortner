import ratelimitter from "express-rate-limit";

export const authRateLimiter = ratelimitter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10,
  message: {
    success: false,
    message:
      "Too many requests from this IP, please try again after 15 minutes",
  },
});
export const apiRateLimiter = ratelimitter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 300,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again after an hour",
  },
});
