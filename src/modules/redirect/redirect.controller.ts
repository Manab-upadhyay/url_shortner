import { redirect } from "./redirect.service";
import { asyncHandler } from "../../utils/asynchandler";
import { ApiError } from "../../utils/ApiError";

export const redirectController = asyncHandler(async (req: any, res: any) => {
  const shortCode = req.params.shortCode;
  const ip =
    req.headers["x-forwarded-for"]?.toString().split(",")[0] ||
    req.socket.remoteAddress ||
    "";

  const userAgent = req.headers["user-agent"] || "";
  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }
  const url = await redirect(shortCode, ip, userAgent);
  return res.redirect(url);
});
