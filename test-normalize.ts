import normalizeHourlyData from "./src/utils/normaliseHourlyAnalytics";

const rawData = [
  {
    _id: "69a83d37ce116bb237a80825", // Mocking the objectId
    apiKeyId: "69a83bb14ca0cef23e358231",
    hour: 19,
    userId: "69a6f9fba5460d51d72ae64d",
    date: '2026-03-04',
    __v: 0,
    createdAt: "2026-03-04T14:10:00.047Z",
    endpointBreakdown: new Map(),
    errorCount: 0,
    totalRequests: 9,
    updatedAt: "2026-03-04T14:25:00.046Z"
  }
];

console.dir(normalizeHourlyData(rawData), { depth: null });
