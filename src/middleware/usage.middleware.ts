import { Request, Response, NextFunction } from "express";
import { PLAN_LIMITS } from "../config/plan.config";
import { getCurrentUsage } from "../modules/overallUsage/overAllUsage.service";
import { ApiError } from "../utils/ApiError";

interface plan {
  free: string[];
  pro: string;
}
export const checkApiLimit = async (
  req: any,
  res: Response,
  next: NextFunction,
) => {
  const user = req.user; // from protect middleware
  const usage = await getCurrentUsage(user._id);

  const limit = PLAN_LIMITS[user.plan].apiRequestsPerMonth;

  if (usage && usage.apiRequests >= limit) {
    throw new ApiError(429, "Monthly API limit exceeded. Upgrade your plan.");
  }

  next();
};

export const checkLinkLimit = async (req: any, res: any, next: any) => {
  const userId = req.userId;
  const user = req.user; // if available

  const usage = await getCurrentUsage(userId);

  const limit = PLAN_LIMITS[user.plan].linksPerMonth;

  if (usage && usage.apiRequests >= limit) {
    throw new ApiError(429, "Monthly API limit exceeded. Upgrade your plan.");
  }

  next();
};
