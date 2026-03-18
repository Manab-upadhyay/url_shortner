import { validateApiKey } from "../modules/apiKey/apiKey.service";
import { asyncHandler } from "../utils/asynchandler";
import { ApiError } from "../utils/ApiError";
import { incrementApiUsage } from "../modules/apiUsage/apiUsage.service";
import logger from "../utils/logger";
export const apiKeyAuth = asyncHandler(
  async (req: any, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(400, "API key required");
    }

    const fullKey = authHeader.split(" ")[1];

    const apiKey = await validateApiKey(fullKey);
    req.userId = apiKey.userId.toString();
    req.apiKeyId = apiKey._id.toString();

    // Track API usage
    await incrementApiUsage(req.userId, req.apiKeyId, req.path);
    next();
  },
);
