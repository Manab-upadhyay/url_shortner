import { Worker } from "bullmq";
import { redis } from "../config/redis.config";
import countModel from "../modules/count/count.model";
import Link from "../modules/link/link.model";
import ConnectToDatabase from "../config/db.config";

const worker = new Worker(
  "analyticsQueue",
  async (job) => {
    ConnectToDatabase();
    const { linkId, ip, userAgent } = job.data;
    console.log(job.data);

    const getLocation = await fetch(
      `https://api.ipapi.com/api/${ip}?access_key=${process.env.IP_API_KEY}`,
    );
    const data = await getLocation.json();
    const userLocation = {
      regionName: data.region_name,
      countryName: data.country_name,
      city: data.city,
    };

    await Link.updateOne({ _id: linkId }, { $inc: { clicks: 1 } });
    await countModel.create({
      linkId,
      ip,
      userAgent,
      location: userLocation,
    });
  },
  {
    connection: redis,
  },
);
worker.on("ready", () => {
  console.log("Analytics worker started and ready");
});
worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.error(`Job ${job?.id} failed`, err);
});
