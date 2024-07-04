import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { EXPRESS_VALIDATION } from "../utility/errorConstants";
import { ApiError } from "../utility/apiError";
// import {} from ""

export const handleValidation = (req: Request) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errs = "";
    for (let i = 0; i < errors.array().length; i++) {
      errs += `<- ${errors.array()[i].msg} -> `;
    }
    throw new ApiError(errs, EXPRESS_VALIDATION, 403);
  }
};
