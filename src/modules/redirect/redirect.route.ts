import { redirectController } from "./redirect.controller";
import { Router } from "express";

const redirectRoute = Router();
redirectRoute.get("/:shortCode", redirectController);
export default redirectRoute;
