import {
  getUserAnalytics,
  getLinkAnalytics,
  getTopLinks,
} from "./analytics.service";
import { asyncHandler } from "../../utils/asynchandler";
import { ApiError } from "../../utils/ApiError";
export const getUserAnalyticsController = asyncHandler(
  async (req: any, res: any) => {
    const userId = req.user._id;
    const analytics = await getUserAnalytics(userId);
    res.status(200).json(analytics);
  },
);
export const getLinkAnalyticsController = asyncHandler(
  async (req: any, res: any) => {
    const userId = req.user._id;
    const { linkId } = req.params;
    if (!linkId) {
      throw new ApiError(400, "Link ID is required");
    }
    const analytics = await getLinkAnalytics(linkId, userId);
    res.status(200).json(analytics);
  },
);
export const getTopLinksController = asyncHandler(
  async (req: any, res: any) => {
    const userId = req.user._id;
    const { limit } = req.query;
    if (limit && isNaN(parseInt(limit))) {
      throw new ApiError(400, "Limit must be a number");
    }
    const topLinks = await getTopLinks(userId, parseInt(limit) || 5);
    res.status(200).json(topLinks);
  },
);

export default {
  getUserAnalyticsController,
  getLinkAnalyticsController,
  getTopLinksController,
};
