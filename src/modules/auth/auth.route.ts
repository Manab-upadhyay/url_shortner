import { Router } from "express";
import {
  signupController,
  verifySignupController,
  loginController,
  logoutController,
  getUserController,
  updateUserPasswordController,
} from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

// Public
router.post("/signup", signupController);
router.post("/verify-signup", verifySignupController);
router.post("/login", loginController);
router.put("/updatePassword", updateUserPasswordController);

// Protected
router.post("/logout", protect, logoutController);
router.get("/me", protect, getUserController);

export default router;
