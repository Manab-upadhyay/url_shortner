import { getApiUsage } from "./apiUsage.service";
import { Request, Response } from "express";
import { asyncHandler } from "../../utils/asynchandler";
import { success } from "zod";

const getApiUsageController = asyncHandler(async (req: any, res: Response) => {
  const userId = req.user._id;
  const apiUsage = await getApiUsage(userId);
  res.status(200).json({ success: true, usage: apiUsage });
});
