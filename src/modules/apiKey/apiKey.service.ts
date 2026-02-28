import ApiKey from "./apiKey.model";
import {
  generateRandomString,
  hashString,
} from "../../utils/generateRandomString";

export const getApiKeysForUser = async (userId: string) => {
  return ApiKey.find({ userId, isActive: true }).select("-keyHash");
};
export const createApiKey = async (
  userId: string,
  name: string,
  planLimit: any,
) => {
  // Optional: Check plan limit before creating
  //   const existingKeys = await ApiKey.countDocuments({ userId }); // will work on this logic later

  //   if (existingKeys >= planLimit) {
  //     throw new Error("API key limit reached for your plan");
  //   }

  // Generate prefix
  const prefix = `lf_live_${generateRandomString(4)}`;

  // Generate secret
  const secret = generateRandomString(32);

  const keyHash = hashString(secret);

  const apiKey = await ApiKey.create({
    userId,
    name,
    prefix,
    keyHash,
  });

  const fullKey = `${prefix}.${secret}`;

  return {
    apiKey,
    fullKey,
  };
};
export const revokeApiKey = async (userId: string, apiKeyId: string) => {
  const apiKey = await ApiKey.findOne({
    _id: apiKeyId,
    userId,
  });

  if (!apiKey) {
    throw new Error("API key not found");
  }

  apiKey.isActive = false;
  await apiKey.save();

  return apiKey;
};
export const validateApiKey = async (fullKey: string) => {
  const [prefix, secret] = fullKey.split(".");

  if (!prefix || !secret) {
    throw new Error("Invalid API key format");
  }

  const apiKey = await ApiKey.findOne({ prefix });

  if (!apiKey || !apiKey.isActive) {
    throw new Error("Invalid API key");
  }

  const incomingHash = hashString(secret);

  if (incomingHash !== apiKey.keyHash) {
    throw new Error("Invalid API key");
  }

  return apiKey;
};
