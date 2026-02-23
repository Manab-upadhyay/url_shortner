import { date } from "zod";
import overAllUsageModel from "./overAllUsage.model";
import getCurrentYearMonth from "../../utils/getCurrentYearMonth";
async function incrementLinkCreation(userId: string) {
  const { month, year } = getCurrentYearMonth;

  await overAllUsageModel.updateOne(
    { userId, month, year },
    { $inc: { linksCreated: 1 } },
    { upsert: true },
  );
}
async function getCurrentUsage(userId: string) {
  const { month, year } = getCurrentYearMonth;

  return overAllUsageModel.findOne({ userId, month, year });
}
export { incrementLinkCreation, getCurrentUsage };
