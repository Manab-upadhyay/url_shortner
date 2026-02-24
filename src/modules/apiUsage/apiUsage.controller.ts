import { getApiUsage } from "./apiUsage.service";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asynchandler";

const getApiUsageController = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user._id;
  const apiUsage = await getApiUsage(userId);
  res.status(200).json({ success: true, usage: apiUsage });
});

export default getApiUsageController;
