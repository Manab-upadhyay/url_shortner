import ConnectToDatabase from "./src/config/db.config";
import { incrementLinkCreation, incrementClick, incrementApiRequest, getCurrentUsage } from "./src/modules/overallUsage/overAllUsage.service";
import Usage from "./src/modules/overallUsage/overAllUsage.model";
import mongoose from "mongoose";

async function test() {
  await ConnectToDatabase();
  const userId = new mongoose.Types.ObjectId().toString();

  console.log("Testing increment functions...");
  
  await incrementLinkCreation(userId);
  await incrementClick(userId);
  await incrementApiRequest(userId);

  const { usage } = await getCurrentUsage(userId);
  console.log("Current Usage:", JSON.stringify(usage, null, 2));

  if (usage.linksCreated === 1 && usage.totalClicks === 1 && usage.apiRequests === 1) {
    console.log("✅ Basic increment test passed!");
  } else {
    console.log("❌ Basic increment test failed!");
  }

  // Clean up
  await Usage.deleteMany({ userId });
  await mongoose.connection.close();
}

test().catch(console.error);
