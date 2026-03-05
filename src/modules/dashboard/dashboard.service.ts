import {
  getClicksGroupedByHour,
  getWeeklyTrend,
  getUserAnalytics,
} from "../analytics/analytics.service";
import { getUserLinks } from "../link/link.service";
import { getApiUsage } from "../apiUsage/apiUsage.service";

export async function getDashboardData(userId: string, page: number = 1, limit: number = 10) {

  const [perHourClicks, userAnalytics, userLinks, apiRequests, weeklyTrend] =
    await Promise.all([
      getClicksGroupedByHour(userId),
      getUserAnalytics(userId),
      getUserLinks(userId, page, limit),
      getApiUsage(userId),
      getWeeklyTrend(userId),
    ]);

  return {
    perHourClicks: perHourClicks ?? [],
    userAnalytics: userAnalytics ?? { totalLinks: 0, totalClicks: 0 },
    userLinks: userLinks.links ?? [],
    totalLinks: userLinks.totalLinks ?? 0,
    apiRequests: apiRequests ?? [],
    weeklyTrend: weeklyTrend ?? {
      last7DaysClicks: 0,
      previous7DaysClicks: 0,
      percentage: 0,
      isPositive: true,
    },
  };
}
