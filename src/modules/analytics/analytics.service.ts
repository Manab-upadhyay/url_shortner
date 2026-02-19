import Link from "../link/link.model";
import mongoose from "mongoose";
async function getLinkAnalytics(linkId: string, userId: string) {
  const link = await Link.findOne({ _id: linkId, userId });
  if (!link) {
    throw new Error("Link not found or unauthorized");
  }
  const analytics = await Link.aggregate([
    { $match: { _id: link._id } },
    {
      $project: {
        totalClicks: "$clicks",
        createdAt: 1,
      },
    },
  ]);
  return analytics[0];
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
