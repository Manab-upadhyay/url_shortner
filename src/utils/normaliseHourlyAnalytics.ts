export default function normalizeHourlyData(rawData: any[]) {
  const currentHour = new Date().getHours();
  const hoursMap = new Map<number, number>();

  rawData.forEach((item) => {
    const hour = item.hour ?? item._id?.hour ?? item._id; // supports both structures
    const total = item.total ?? item.totalClicks ?? item.totalRequests ?? 0;

    if (hour !== undefined) {
      hoursMap.set(hour, total);
    }
  });

  const result = [];

for (let i = 0; i < 24; i++) {
  result.push({
    hour: `${i}:00`,
    total: hoursMap.get(i) ?? 0,
  });
}

  return result;
}