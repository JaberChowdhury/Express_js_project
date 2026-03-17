import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../config/index.ts";

const auth = () => {
  return (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    console.log({ token });
    if (!token) {
      res.status(500).json({ message: "You are not allowed" });
    }
    const decode = jwt.verify(token as string, config.jwt_secret as string);
    console.log({ decode });
    // res.send({ success: true, token });
    next();
  };
};

export default auth;
