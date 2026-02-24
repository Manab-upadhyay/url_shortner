import { Request, Response, NextFunction } from "express";
import { PLAN_LIMITS } from "../config/plan.config";
import { getCurrentUsage } from "../modules/overallUsage/overAllUsage.service";
import { ApiError } from "../utils/ApiError";
import User from "../modules/auth/auth.model";

export const checkApiLimit = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "User not found");

  const usage = await getCurrentUsage(userId);

  const limit = PLAN_LIMITS[user.plan].apiRequestsPerMonth;

  if (usage && usage.apiRequests >= limit) {
    throw new ApiError(429, "Monthly API limit exceeded.");
  }

  next();
};

export const checkLinkLimit = async (req: any, res: any, next: any) => {
  const userId = req.userId;

  const user = await User.findById(userId);
  if (!user) throw new ApiError(401, "User not found");
  const usage = await getCurrentUsage(userId);

  const limit = PLAN_LIMITS[user.plan].linksPerMonth;

  if (usage && usage.linksCreated >= limit) {
    throw new ApiError(429, "Monthly API limit exceeded. Upgrade your plan.");
  }

  next();
};
