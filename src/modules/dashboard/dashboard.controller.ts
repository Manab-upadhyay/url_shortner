import { getDashboardData } from "./dashboard.service";

import { asyncHandler } from "../../utils/asynchandler";
export const getDashboardDataController = asyncHandler(
  async (req: any, res: any) => {
    const userId = req.user._id;
    const dashboardData = await getDashboardData(userId);
    res.status(200).json(dashboardData);
  },
);
