import { Response } from "express";

export const errorHandler = (
  res: Response,
  statusCode = 500,
  message = "Internal Server Error"
) => {
  return res.status(statusCode).json({
    success: false,
    message,
  });
};

export const asyncError =
  (passedFunc: any) => (req: Request, res: Response) => {
    return Promise.resolve(passedFunc(req, res)).catch((err) => {
      console.error(err);
      return res.status(500).json({
        success: false,
        message: err.message,
      });
    });
  };
