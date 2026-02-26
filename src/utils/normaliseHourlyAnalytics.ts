export default function normalizeHourlyData(rawData: any[]) {
  const currentHour = new Date().getHours();
  const hoursMap = new Map<number, number>();

  rawData.forEach((item) => {
    hoursMap.set(item._id.hour, item.total || item.totalClicks);
  });

  const result = [];

  for (let i = 0; i <= currentHour; i++) {
    result.push({
      hour: `${i}:00`,
      total: hoursMap.get(i) || 0,
    });
  }

  return result;
}
