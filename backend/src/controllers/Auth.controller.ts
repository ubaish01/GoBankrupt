import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../error/error";
import { STATUS } from "../config/contants";
import {
  GenerateForgetPasswordOtpMailTemplate,
  GenerateOtpMailTemplate,
  generateOTP,
  isOtpExpired,
  oneMinutePassed,
} from "../helper/helperFunctions";
import { cookieSetter, generateToken, sendMail } from "../helper/services";
import { ModifiedRequest } from "../definitionFile";
const User = mongoose.model("User");
const Wallet = mongoose.model("Wallet");
import { z } from "zod";

const SignupSchema = z.object({
  email: z.string().email("Invalid email format."),
  name: z.string().min(4, "Name must be at least 4 characters long."),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long.")
    .refine(
      (value) =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          value
        ),
      {
        message:
          "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).",
      }
    ),
});

// Function to validate signup input
function validateSignupInput(data: any) {
  try {
    // Validate input against the schema
    const validatedData = SignupSchema.parse(data);
    return { success: true, data: validatedData };
  } catch (error: any) {
    return { success: false, error: error.errors };
  }
}

export const AuthContollers = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password, name } = req.body;
      const validation = validateSignupInput(req.body);

      if (!validation.success)
        return errorHandler(
          res,
          STATUS.BAD_REQUEST,
          ` ${validation.error?.[0]?.message}`
        );

      console.log(validation);

      if (!email || !password || !name)
        return errorHandler(res, STATUS.OK, "Input Data missing");

      const userFound = await User.findOne({
        email: email.toLowerCase(),
        email_verified: true,
      });
      if (userFound) return errorHandler(res, 400, "Email already exists");

      const salt = 10;
      const hashedPassword = bcrypt.hashSync(password, salt);

      const subject = "Email verification";
      const otp = generateOTP();
      const mailTemplate = GenerateOtpMailTemplate(name, otp);

      const user = new User({
        name: name?.toLowerCase(),
        email: email.toLowerCase(),
        password: hashedPassword,
        otp,
        last_otp_sent: Date.now(),
        otp_sent_count: 1,
      });

      const { password: pwd, ...rest } = user._doc;

      // generating access token for authentication
      await user.save();

      // sending verification mail
      await sendMail(email, subject, mailTemplate);

      return res.status(201).json({
        success: true,
        user: { _id: user._id, email },
        message: "Otp sent to your email.",
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const foundUser = await User.findOne({
        email,
        email_verified: true,
      });
      if (!foundUser) return errorHandler(res, 404, "User not found");

      const passwordMatch = await bcrypt.compare(password, foundUser.password);
      if (!passwordMatch)
        return errorHandler(res, 401, "Invalid email or password!");

      const {
        password: pwd,
        otp,
        otp_sent_count,
        last_otp_sent,
        last_login,
        last_activity,
        ...rest
      } = foundUser._doc;

      const access_token = generateToken(foundUser._id);
      cookieSetter(res, access_token, true);
      const wallet = await Wallet.findOne({ user: foundUser._id });

      foundUser.last_login = Date.now();
      foundUser.last_activity = Date.now();
      foundUser.token = access_token;
      await foundUser.save();

      return res.status(200).json({
        success: true,
        message: "Logged in successfully",
        user: {
          ...rest,
        },
        access_token,
        wallet,
      });
    } catch (error: any) {
      console.error(error);
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  verifyAccount: async (req: Request, res: Response) => {
    try {
      const { userID, otp } = req.body;
      const user = await User.findById(userID);

      //return error is user not found
      if (!user) return errorHandler(res, 404, "User not found");

      const otpMatched = otp == user.otp;
      const expired = isOtpExpired(user.last_otp_sent);

      // if otp did not match or already expired return error message
      if (!otpMatched || expired)
        return errorHandler(
          res,
          403,
          expired ? "Otp is not valid anymore." : "Otp did't matched"
        );

      user.otp = null;
      user.last_login = Date.now();
      user.last_activity = Date.now();
      user.email_verified = true;
      await user.save();

      const {
        password,
        otp: otpp,
        otp_sent_count,
        last_otp_sent,
        last_login,
        last_activity,
        ...rest
      } = user._doc;

      const access_token = generateToken(user._id);
      cookieSetter(res, access_token, true);

      return res.status(200).json({
        success: true,
        message: "Account verified successfully",
        user: {
          ...rest,
        },
        access_token,
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  resendVerificationOtp: async (req: Request, res: Response) => {
    try {
      const { userId, email, type } = req.body;
      const RESEND_TYPE = {
        VERIFICATION: 1,
        FORGET_PASSWORD: 2,
      };

      const user = await (type === RESEND_TYPE.FORGET_PASSWORD
        ? User.findOne({ email, email_verified: true })
        : User.findById(userId));

      //return error is user not found
      if (!user) return errorHandler(res, 404, "User not found");

      // we will only resend the otp if at least 1 minute is passed
      const resendValid = oneMinutePassed(user.last_otp_sent);

      if (!resendValid)
        return errorHandler(
          res,
          400,
          "Please wait for a minute before resending the otp"
        );

      const otp = generateOTP();
      const template =
        type == RESEND_TYPE.FORGET_PASSWORD
          ? GenerateForgetPasswordOtpMailTemplate(user.name, otp)
          : GenerateOtpMailTemplate(user.name, otp);

      user.otp = otp;
      user.otp_sent_count += 1;
      user.last_otp_sent = Date.now();
      await user.save();

      await sendMail(user.email, "OTP - Verify", template);

      return res.status(200).json({
        success: true,
        message: "Otp sent successfully",
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  forgetPassword: async (req: Request, res: Response) => {
    try {
      const email = req.body.email;
      const user = await User.findOne({
        email: email.toLowerCase(),
        email_verified: true,
      });
      if (!user) return errorHandler(res, 404, "user not found");

      const otp = generateOTP();
      const template = GenerateForgetPasswordOtpMailTemplate(user.name, otp);
      const subject = "Forget Password";
      await sendMail(user.email, subject, template);

      user.otp = otp;
      user.last_otp_sent = Date.now();
      await user.save();

      const userData = {
        email: user.email,
        _id: user._id,
      };

      return res.status(200).send({
        success: true,
        message: "Otp sent to the registered email",
        user: userData,
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  verifyOtpForgetPassword: async (req: Request, res: Response) => {
    try {
      const { otp, email, password } = req.body;

      const user = await User.findOne({
        email: email.toLowerCase(),
        email_verified: true,
      });

      if (!user) return errorHandler(res, 404, "User not found");

      const otpMatched = otp == user.otp;
      const expired = isOtpExpired(user.last_otp_sent);

      // if otp did not match or already expired return error message
      if (!otpMatched || expired) {
        return res.status(400).json({
          success: false,
          message: expired ? "Otp is not valid anymore." : "Otp did't matched",
        });
      }

      const salt = 10;
      const hashdPassword = bcrypt.hashSync(password, salt);

      user.otp = null;
      user.otp_sent_count += 1;
      user.last_login = Date.now();
      user.last_activity = Date.now();
      user.password = hashdPassword;
      await user.save();

      const {
        password: pwd,
        api_calls,
        otp: otpp,
        otp_sent_count,
        last_otp_sent,
        last_login,
        ...rest
      } = user._doc;

      const access_token = generateToken(user._id);
      cookieSetter(res, access_token, true);

      return res.status(200).json({
        success: true,
        message: "Password changed successfully",
        user: {
          ...rest,
        },
        access_token,
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  logout: async (req: Request, res: Response, next: NextFunction) => {
    try {
      cookieSetter(res, "", false);
      req.logout(function (err) {
        if (err) {
          return next(err);
        }
        return res.status(200).json({
          success: true,
          message: "Logged out successfully",
        });
      });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  getUser: async (req: ModifiedRequest, res: Response) => {
    try {
      if (req.user) {
        const foundUser = await User.findById(req.user._id);
        if (!foundUser) return errorHandler(res, 404, "User not found");
        foundUser.last_login = Date.now();
        foundUser.last_activity = Date.now();
        await foundUser.save();
        const wallet = await Wallet.findOne({ user: foundUser._id });
        const {
          password: pwd,
          otp,
          otp_sent_count,
          last_otp_sent,
          last_login,
          last_activity,
          ...rest
        } = foundUser._doc;

        const access_token = generateToken(foundUser._id);
        cookieSetter(res, access_token, true);

        return res.status(200).json({
          success: true,
          message: "Logged in successfully",
          user: {
            ...rest,
          },
          wallet,
          access_token,
        });
      } else {
        return errorHandler(res, 403, "You are not authenticated");
      }
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },

  userOnboard: async (req: ModifiedRequest, res: Response) => {
    try {
      const user = await User.findById(req.user._id);
      console.log(req.body);
      const avatar = parseInt(req.body?.avatar);
      const balance = parseInt(req.body?.balance?.worth || "100000000");
      if (!avatar)
        return errorHandler(
          res,
          STATUS.BAD_REQUEST,
          "Selecting avatar is mandatory"
        );
      user.avatar = avatar;
      user.onboard = true;

      const wallet = await Wallet.create({
        user: user._id,
        balance: balance * 100,
      });

      await user.save();
      const {
        password: pwd,
        otp,
        otp_sent_count,
        last_otp_sent,
        last_login,
        last_activity,
        ...rest
      } = user._doc;
      return res.json({ success: true, user: { ...rest }, wallet });
    } catch (error: any) {
      return errorHandler(res, STATUS.INTERNAL_SERVER_ERROR, error.message);
    }
  },
};
