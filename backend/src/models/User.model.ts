import mongoose from "mongoose";
import { AVATAR_TYPE, LOGIN_PLATFORM, USER_ROLE } from "../config/contants";
const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: Number,
      default: USER_ROLE.USER,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: Number,
      default: null,
    },
    onboard: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      default: null,
    },
    otp_sent_count: {
      type: Number,
      default: 1,
    },
    last_otp_sent: {
      type: Date,
      default: null,
    },
    login_platform: {
      type: Number,
      default: LOGIN_PLATFORM.EMAIL,
    },
    token: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

mongoose.model("User", UserSchema);
