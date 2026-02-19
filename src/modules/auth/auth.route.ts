import { Router } from "express";
import {
  signupController,
  loginController,
  logoutController,
  getUserController,
} from "./auth.controller";
import { protect } from "../../middleware/auth.middleware";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

router.post("/logout", protect, logoutController);
router.get("/me", protect, getUserController);

export default router;
