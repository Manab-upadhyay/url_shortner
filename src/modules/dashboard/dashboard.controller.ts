import { getDashboardData } from "./dashboard.service";

import { asyncHandler } from "../../utils/asynchandler";
import { ApiError } from "../../utils/ApiError";
export const getDashboardDataController = asyncHandler(
  async (req: any, res: any) => {
    const userId = req.user._id;
    const { page, limit } = req.query;
   
    if (page && isNaN(parseInt(page))) {
      throw new ApiError(400, "Page must be a number");
    }
    if (limit && isNaN(parseInt(limit))) {
      throw new ApiError(400, "Limit must be a number");
    }
    const dashboardData = await getDashboardData(userId, parseInt(page) || 1, parseInt(limit) || 10);
    res.status(200).json(dashboardData);
  },
);
