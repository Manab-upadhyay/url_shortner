import {
  getClicksGroupedByHour,
  getWeeklyTrend,
  getUserAnalytics,
} from "../analytics/analytics.service";
import { getUserLinks } from "../link/link.service";
import { getApiUsage } from "../apiUsage/apiUsage.service";

export async function getDashboardData(userId: string) {
  const [perHourClicks, userAnalytics, userLinks, apiRequests, weeklyTrend] =
    await Promise.all([
      getClicksGroupedByHour(userId),
      getUserAnalytics(userId),
      getUserLinks(userId),
      getApiUsage(userId),
      getWeeklyTrend(userId),
    ]);

  return {
    perHourClicks: perHourClicks ?? [],
    userAnalytics: userAnalytics ?? { totalLinks: 0, totalClicks: 0 },
    userLinks: userLinks ?? [],
    apiRequests: apiRequests ?? [],
    weeklyTrend: weeklyTrend ?? {
      last7DaysClicks: 0,
      previous7DaysClicks: 0,
      percentage: 0,
      isPositive: true,
    },
  };
}
