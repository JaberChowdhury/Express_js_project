import type { Request, Response } from "express";
import { authService } from "./auth.service.ts";

const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser(email, password);
    res.status(200).send({
      success: true,
      message: "Login successfuly",
      data: result,
    });
  } catch (error: any) {
    res.status(500).send({
      success: false,
      message: error.message,
    });
  }
};

export const authController = { loginUser };
