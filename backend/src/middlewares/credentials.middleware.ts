import { NextFunction, Request, Response } from "express";
import { allowedOrigin } from "../config/allowedOrigins";

export const credentials = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const origin = req.headers.origin;
  console.log(req.url);
  // console.log(origin);
  if (origin === "https://circlesss.onrender.com") {
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
};
