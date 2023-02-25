import { NextFunction, Request, Response } from "express";
import { CustomError } from "../errors/custom-error";

export const errorHandler =  (
    err: Error,
    req: Request,
  res: Response,
  next: NextFunction,
  
) => {
  if (err instanceof CustomError) {
    console.log("Handling invalid request");
    return res.status(err.statusCode).send(JSON.stringify({ errors: err.serializeErrors() }));
  }

  res.status(400).send(JSON.stringify({
    errors: [
      {
        message: "Something went wrong!",
      },
    ],
  }));
};