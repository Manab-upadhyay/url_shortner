import { redirect } from "./redirect.service";
import { asyncHandler } from "../../utils/asynchandler";
import { ApiError } from "../../utils/ApiError";

export const redirectController = asyncHandler(async (req: any, res: any) => {
  const shortCode = req.params.shortCode;
  if (!shortCode) {
    throw new ApiError(400, "Short code is required");
  }
  const url = await redirect(shortCode);
  return res.redirect(url);
});
