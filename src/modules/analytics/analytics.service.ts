import Link from "../link/link.model";
import mongoose from "mongoose";
import countModel from "../count/count.model";
async function getLinkAnalytics(linkId: string, userId: string) {
  const link = await countModel.findOne({ _id: linkId, userId });

  if (!link) {
    throw new Error("Link not found or unauthorized");
  }

  const analytics = await Link.aggregate([
    {
      $match: {
        linkId: linkId,
        createdAt: {
          $gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24h
        },
      },
    },
    {
      $group: {
        _id: {
          hour: { $hour: "$createdAt" },
        },
        total: { $sum: 1 },
      },
    },
    {
      $sort: { "_id.hour": 1 },
    },
  ]);

  return analytics.map((item) => ({
    hour: `${item._id.hour}:00`,
    total: item.total,
  }));
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
async function getTopLinks(userId: string, limit: number = 5) {
  const topLinks = await Link.find({ userId })
    .sort({ clicks: -1 })
    .limit(limit)
    .select("name url shortCode clicks createdAt");

  return topLinks;
}

export { getLinkAnalytics, getUserAnalytics, getTopLinks };
