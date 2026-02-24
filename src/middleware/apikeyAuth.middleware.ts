import { validateApiKey } from "../modules/apiKey/apiKey.service";
import { asyncHandler } from "../utils/asynchandler";
import { ApiError } from "../utils/ApiError";
import { incrementApiUsage } from "../modules/apiUsage/apiUsage.service";
export const apiKeyAuth = asyncHandler(
  async (req: any, res: Response, next: any) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError(400, "API key required");
    }

    const fullKey = authHeader.split(" ")[1];

    const apiKey = await validateApiKey(fullKey);
    console.log("apikey", apiKey);
    req.userId = apiKey.userId.toString();
    req.apiKeyId = apiKey._id.toString();
    console.log("user", req.userId);

    // Track API usage
    await incrementApiUsage(req.userId, req.apiKeyId, req.path);
    next();
  },
);
