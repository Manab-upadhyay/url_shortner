import { verifyToken } from "../utils/jwt.utils";
import User from "../modules/auth/auth.model";
import { ApiError } from "../utils/ApiError";

export const protect = async (req: any, res: any, next: any) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not authenticated",
      });
    }

    const decoded = verifyToken(token) as any;

    const user = await User.findById(decoded.userId);

    if (!user || user.tokenversion !== decoded.tokenVersion) {
      throw new ApiError(401, "Not authenticated");
    }

    req.user = user; // optional, useful for UI
    req.userId = user._id.toString();
    next();
  } catch (error) {
    next(error);
  }
};
