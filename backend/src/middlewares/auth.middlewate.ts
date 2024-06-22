import { Request, Response, NextFunction } from "express";
import { extractJwt, isTokenValid } from "../helper/helperFunctions";
import { RESPONSE_INFO, STATUS, USER_ROLE } from "../config/contants";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import { ModifiedRequest } from "../definitionFile";
import { errorHandler } from "../error/error";
const User = mongoose.model("User");

export const isAuthenticated = async (
  req: ModifiedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const userId = isTokenValid(req);
    if (!userId)
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: "You are not logged in.",
        response_info: RESPONSE_INFO.TOKEN_ERROR,
      });

    const user = await User.findById(userId);
    if (!user)
      return res.status(STATUS.UNAUTHORIZED).json({
        success: false,
        message: "You are not logged in.",
        response_info: RESPONSE_INFO.TOKEN_ERROR,
      });
    req.user = user;
    next();
  } catch (error: any) {
    console.log(error.message);
    return res.status(STATUS.UNAUTHORIZED).json({
      success: false,
      message: "You are not authenticated",
      response_info: RESPONSE_INFO.TOKEN_ERROR,
    });
  }
};

export const isAdmin = async (
  req: ModifiedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const cookie = req.headers.cookie;
    if (!cookie)
      return errorHandler(
        res,
        STATUS.UNAUTHORIZED,
        "You are not authenticated"
      );

    const token = extractJwt(cookie);

    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "");

    const user = await User.findById(decoded._id);
    if (!user)
      return errorHandler(res, STATUS.NOT_ALLOWED, "Token is not valid");

    if (user.role !== USER_ROLE.ADMIN)
      return errorHandler(
        res,
        STATUS.NOT_ALLOWED,
        "You are not allowed to use this route"
      );
    req.user = user;
    next();
  } catch (error) {
    return errorHandler(res, STATUS.UNAUTHORIZED, "You are not authenticated");
  }
};

export const ExtractUser = async (req: Request) => {
  try {
    const userId = isTokenValid(req);
    if (!userId) return null;

    const user = await User.findById(userId);
    if (!user) return null;
    return user;
  } catch (error) {
    return null;
  }
};
