import Link from "../link/link.model";
import mongoose from "mongoose";
import countModel from "../count/count.model";
import normalizeHourlyData from "../../utils/normaliseHourlyAnalytics";

async function getLinkAnalyticsPerHour(linkId: string, userId: string) {
  const link = await Link.findOne({ _id: linkId, userId });

  if (!link) {
    throw new Error("Link not found or unauthorized");
  }

  const analytics = await countModel.aggregate([
    {
      $match: {
        linkId: new mongoose.Types.ObjectId(linkId),
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
        },
      },
    },
    {
      $group: {
        _id: {
          hour: {
            $hour: {
              date: "$createdAt",
              timezone: "Asia/Kolkata",
            },
          },
        },
        total: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.hour": 1 },
    },
  ]);

  return normalizeHourlyData(analytics);
}
async function getLinkAnalytics(linkId: string, userId: string) {
  const link = await Link.findOne({ _id: linkId, userId });
  if (!link) {
    throw new Error("Link not found or unauthorized");
  }
  const LinkDetails = await countModel.find({ linkId });
  return {
    LinkDetails,
    createdAt: link.createdAt,
  };
}

async function getUserAnalytics(userId: string) {
  const analytics = await Link.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLinks: { $sum: 1 },
        totalClicks: { $sum: "$clicks" },
      },
    },
  ]);
  return analytics[0] || { totalLinks: 0, totalClicks: 0 };
}
async function getClicksGroupedByHour(
  userId: string,
  startDate?: Date,
  endDate?: Date,
) {
  // Step 1: Get all user's links
  const links = await Link.find(
    { userId: new mongoose.Types.ObjectId(userId) },
    { _id: 1 },
  );

  const linkIds = links.map((link) => link._id);

  if (linkIds.length === 0) {
    return [];
  }

  // Step 2: Build match stage
  const matchStage: any = {
    linkId: { $in: linkIds },
  };

  if (startDate && endDate) {
    matchStage.createdAt = {
      $gte: startDate,
      $lte: endDate,
    };
  }

  // Step 3: Aggregate clicks
  const analytics = await countModel.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: {
          hour: { $hour: { date: "$createdAt", timezone: "Asia/Kolkata" } },
        },

        totalClicks: { $sum: 1 },
      },
    },
    { $sort: { "_id.hour": 1 } },
  ]);
  return normalizeHourlyData(analytics);
}
async function getTopLinks(userId: string, limit: number = 5) {
  const topLinks = await Link.find({ userId })
    .sort({ clicks: -1 })
    .limit(limit)
    .select("name url shortCode clicks createdAt");

  return topLinks;
}
async function getLastWeekClicks(userId: string) {
  const now = new Date();

  const startOfThisWeek = new Date(now);
  startOfThisWeek.setDate(now.getDate() - 7);

  const startOfLastWeek = new Date(now);
  startOfLastWeek.setDate(now.getDate() - 14);

  const thisWeekClicks = await countModel.countDocuments({
    createdAt: { $gte: startOfThisWeek },
  });

  const lastWeekClicks = await countModel.countDocuments({
    createdAt: {
      $gte: startOfLastWeek,
      $lt: startOfThisWeek,
    },
  });
  return lastWeekClicks;
}
export {
  getLinkAnalytics,
  getUserAnalytics,
  getTopLinks,
  getClicksGroupedByHour,
  getLinkAnalyticsPerHour,
  getLastWeekClicks,
};
