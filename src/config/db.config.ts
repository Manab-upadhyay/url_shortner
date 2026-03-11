import mongoose from "mongoose";
import dotenv from "dotenv";
import logger from "../utils/logger";
dotenv.config();

const uri = process.env.MONGO_DB_URL;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
async function ConnectToDatabase() {
  try {
    await mongoose.connect(uri!);

    logger.info("MongoDB connected successfully");
  } catch (error) {
    logger.error(" Mongo connection failed", error);
    process.exit(1);
  }
}
export default ConnectToDatabase;
