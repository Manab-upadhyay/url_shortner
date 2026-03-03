import { sendWelcomeEmail } from "./email.service";
import { asyncHandler } from "../utils/asynchandler";

export const sendWelcomeEmailController = asyncHandler(
  async (req: any, res: any) => {
    const { email, name } = req.body;
    await sendWelcomeEmail(email, name);
    return res
      .status(200)
      .json({ message: "Welcome email sent successfully" });
  }
);