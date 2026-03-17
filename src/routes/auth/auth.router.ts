import { Router } from "express";
import { authController } from "./auth.controller.ts";

const authRouter = Router();

authRouter.post("/login", authController.loginUser);

export default authRouter;
