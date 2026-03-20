import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import {
  uploadMiddleware,
  uploadAvatarController,
} from "./media.controller";

const mediaRoute = Router();

mediaRoute.post("/upload-image", protect, uploadMiddleware, uploadAvatarController);

export default mediaRoute;
