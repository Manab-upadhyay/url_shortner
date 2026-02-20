import { Worker } from "bullmq";
import { redisConnection } from "../config/redis.config";\
import countModel from "../modules/count/count.model";


const worker = new Worker(
  "analyticsQueue",
  async (job) => {
    const { linkId, ip, userAgent } = job.data;

    
    const getLocation = await fetch (`https://api.ipapi.com/api/${ip}?access_key=${process.env.IP_API_KEY}`)
    const data = await getLocation.json()
    const userLocation = {regionName: data.region_name, countryName: data.country_name, city : data.city}


    await countModel.create({
      linkId,
      ip,
      userAgent,
      location: userLocation
    });
  },
  {
    connection: redisConnection,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});