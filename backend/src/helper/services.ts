import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import nodemailer from "nodemailer";
import { Response, Request } from "express";

export const cookieSetter = (res: Response, token: string, set: boolean) => {
  res.setHeader(
    "Set-Cookie",
    serialize("token", set ? token : "", {
      path: "/",
      httpOnly: false,
      maxAge: set ? 30 * 24 * 60 * 60 * 1000 : 0,
    })
  );
};

export const generateToken = (_id: string) => {
  return jwt.sign({ _id }, process.env.JWT_SECRET || "", {
    expiresIn: "30d",
  });
};

export const sendMail = async (to: string, subject: string, html: string) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const details = {
      from: process.env.MAIL_ID,
      to: to,
      subject: subject,
      html: html,
    };

    const response = await transporter.sendMail(details);
  } catch (error) {
    console.error(error);
  }
};
