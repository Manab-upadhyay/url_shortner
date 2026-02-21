import { validateApiKey } from "../modules/apiKey/apiKey.service";
import { asyncHandler } from "../utils/asynchandler";
import { ApiError } from "../utils/ApiError";
import { incrementApiUsage } from "../modules/apiUsage/usage.service";
export const apiKeyAuth = asyncHandler(async (req: any, next: any) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(400, "API key required");
  }

  const fullKey = authHeader.split(" ")[1];

  const apiKey = await validateApiKey(fullKey);

  req.user._id = apiKey.userId;
  req.apiKeyId = apiKey._id;
  await incrementApiUsage(
    req.user._id.toString(),
    req.apiKeyId.toString(),
    req.route.path,
  );
  next();
});
