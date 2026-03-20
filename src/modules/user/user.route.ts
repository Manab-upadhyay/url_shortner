import { updateUserDetailsController } from "./user.controller";
import { Router } from "express";
import { protect } from "../../middleware/auth.middleware";

const userRoutes = Router();

userRoutes.put("/updateUser", protect, updateUserDetailsController);

export default userRoutes;