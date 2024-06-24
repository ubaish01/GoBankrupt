import jwt from "jsonwebtoken";
import { MONTHS } from "../config/contants";
import Express from "express";
import { MINES_CONSTANTS } from "../config/GameConstants";

export const extractJwt = (cookie: string) => {
  let token: any = cookie?.split("token=");
  if (token) token = token[1];
  if (token) token = token.split(";");
  if (token) token = token[0];

  return token;
};

export const generateOTP = () => {
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < 6; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
};

export const isOtpExpired = (lastOtpSent: Date) => {
  const otpValidityMinutes = 5; // OTP validity duration in minutes
  const currentTime: Date = new Date();
  const timeDifference: any = Number(currentTime) - Number(lastOtpSent);
  const timeDifferenceMinutes = timeDifference / (1000 * 60);
  return timeDifferenceMinutes > otpValidityMinutes;
};

export const oneMinutePassed = (lastOtpSent: Date) => {
  const otpValidityMinutes = 1; // OTP validity duration in minutes
  const currentTime = new Date();
  const timeDifference = Number(currentTime) - Number(lastOtpSent);
  const timeDifferenceMinutes = timeDifference / (1000 * 60);
  return timeDifferenceMinutes > otpValidityMinutes;
};

export const isTokenValid = (req: Express.Request) => {
  const cookie = req.headers.cookie;
  if (!cookie) return null;
  const token = extractJwt(cookie);

  if (!token) return null;

  const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "Jfmamjja1");

  if (!decoded) return null;

  return decoded?._id;
};

export const generateRandomNumber = (min: number = 0, max: number = 10) => {
  const number = Math.floor(Math.random() * (max - min + 1));
  return number + min;
};

interface boxType {
  row: number;
  col: number;
}

type Row = number[];

export const CreateMineGamePrivateState = (mines: number) => {
  const rows = 5,
    cols = 5;
  const state: Row[] = [];

  const mineIndex: { row: number; col: number }[] = [];
  while (mineIndex.length < mines) {
    const row = generateRandomNumber(0, 4);
    const col = generateRandomNumber(0, 4);
    const includes = mineIndex.filter(
      (box) => box.row === row && box.col === col
    )?.length;
    if (!includes) mineIndex.push({ row, col });
  }

  for (let i = 0; i < rows; i++) {
    const currRow: Row = [];
    for (let j = 0; j < cols; j++) {
      const includes = mineIndex.filter(
        (box) => box.row === i && box.col === j
      )?.length;

      if (includes) currRow.push(MINES_CONSTANTS.BOX_STATE.MINE);
      else currRow.push(MINES_CONSTANTS.BOX_STATE.GEM);
    }
    state.push(currRow);
  }

  return state;
};

export const CreateMineGamePublicState = () => {
  const rows = 5;
  const cols = 5;

  const state: Row[] = [];

  for (let i = 0; i < rows; i++) {
    const currRow: Row = [];
    for (let j = 0; j < cols; j++)
      currRow.push(MINES_CONSTANTS.BOX_STATE.UNKNOWN);
    state.push(currRow);
  }
  return state;
};

export const currentDate = () => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentDate = new Date();
  const day = currentDate.getDate();
  const monthIndex = currentDate.getMonth();
  const month = months[monthIndex];
  const year = currentDate.getFullYear();

  return `${day} ${month}, ${year}`;
};

export const getValidity = (years: number) => {
  let currentDate = new Date();
  // Add one year to the current date
  currentDate.setFullYear(currentDate.getFullYear() + years);
  return currentDate;
};

export const GenerateOtpMailTemplate = (username: string, otp: string) => {
  const template = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Static Template</title>
    
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
    </head>
    
    <body style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        ">
        <div style="
            max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
            background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
            background-repeat: no-repeat;
            background-size: 800px 452px;
            background-position: top center;
            font-size: 14px;
            color: #434343;
          ">
            <header>
                <table style="width: 100%;">
                    <tbody>
                        <tr style="height: 0;">
                            <td>
                                <div style="font-size: 2rem;font-weight: 700;">${
                                  process.env.WEBSITE_URL
                                }</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${currentDate()}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </header>
    
            <main>
                <div style="
                margin: 0;
                margin-top: 70px;
                padding: 92px 30px 115px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              ">
                    <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                        <h1 style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 500;
                    color: #1f1f1f;
                  ">
                            Your OTP
                        </h1>
                        <p style="
                    margin: 0;
                    margin-top: 17px;
                    font-size: 16px;
                    font-weight: 500;
                  ">
                            Hey ${username},
                        </p>
                        <p style="
                    margin: 0;
                    margin-top: 17px;
                    font-weight: 500;
                    letter-spacing: 0.56px;
                  ">
                            Thank you for choosing ${
                              process.env.COMPANY_NAME
                            } platform. Use the following OTP
                            to verify your email address. OTP is
                            valid for
                            <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                            Do not share this code with others.
                        </p>
                        <p style="
                    margin: 0;
                    margin-top: 60px;
                    font-size: 40px;
                    font-weight: 600;
                    letter-spacing: 25px;
                    color: #ba3d4f;
                  ">
                            ${otp}
                        </p>
                    </div>
                </div>
    
                <p style="
                max-width: 400px;
                margin: 0 auto;
                margin-top: 90px;
                text-align: center;
                font-weight: 500;
                color: #8c8c8c;
              ">
                    Need help? Ask at
                    <a href="mailto:archisketch@gmail.com"
                        style="color: #499fb6; text-decoration: none;">${
                          process.env.HELP_MAIL
                        }</a>
                    or visit our
                    <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
                </p>
            </main>
    
            <footer style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            ">
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                    Copyright © 2024 ${
                      process.env?.WEBSITE_URL
                    } All rights reserved.
                </p>
            </footer>
        </div>
    </body>
    
    </html>`;

  return template;
};

export const GenerateForgetPasswordOtpMailTemplate = (
  username: string,
  otp: string
) => {
  const template = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta http-equiv="X-UA-Compatible" content="ie=edge" />
        <title>Static Template</title>
    
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
    </head>
    
    <body style="
          margin: 0;
          font-family: 'Poppins', sans-serif;
          background: #ffffff;
          font-size: 14px;
        ">
        <div style="
            max-width: 680px;
            margin: 0 auto;
            padding: 45px 30px 60px;
            background: #f4f7ff;
            background-image: url(https://archisketch-resources.s3.ap-northeast-2.amazonaws.com/vrstyler/1661497957196_595865/email-template-background-banner);
            background-repeat: no-repeat;
            background-size: 800px 452px;
            background-position: top center;
            font-size: 14px;
            color: #434343;
          ">
            <header>
                <table style="width: 100%;">
                    <tbody>
                        <tr style="height: 0;">
                            <td>
                                <div style="font-size: 2rem;font-weight: 700;">${
                                  process.env.WEBSITE_URL
                                }</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${currentDate()}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </header>
    
            <main>
                <div style="
                margin: 0;
                margin-top: 70px;
                padding: 92px 30px 115px;
                background: #ffffff;
                border-radius: 30px;
                text-align: center;
              ">
                    <div style="width: 100%; max-width: 489px; margin: 0 auto;">
                        <h1 style="
                    margin: 0;
                    font-size: 24px;
                    font-weight: 500;
                    color: #1f1f1f;
                  ">
                            Your OTP
                        </h1>
                        <p style="
                    margin: 0;
                    margin-top: 17px;
                    font-size: 16px;
                    font-weight: 500;
                  ">
                            Hey ${username},
                        </p>
                        <p style="
                    margin: 0;
                    margin-top: 17px;
                    font-weight: 500;
                    letter-spacing: 0.56px;
                  ">
                            Thank you for choosing ${
                              process.env.COMPANY_NAME
                            } platform. Use the following OTP
                            to forget your password. OTP is
                            valid for
                            <span style="font-weight: 600; color: #1f1f1f;">5 minutes</span>.
                            Do not share this code with others.
                        </p>
                        <p style="
                    margin: 0;
                    margin-top: 60px;
                    font-size: 40px;
                    font-weight: 600;
                    letter-spacing: 25px;
                    color: #ba3d4f;
                  ">
                            ${otp}
                        </p>
                    </div>
                </div>
    
                <p style="
                max-width: 400px;
                margin: 0 auto;
                margin-top: 90px;
                text-align: center;
                font-weight: 500;
                color: #8c8c8c;
              ">
                    Need help? Ask at
                    <a href="mailto:archisketch@gmail.com"
                        style="color: #499fb6; text-decoration: none;">${
                          process.env.HELP_MAIL
                        }</a>
                    or visit our
                    <a href="" target="_blank" style="color: #499fb6; text-decoration: none;">Help Center</a>
                </p>
            </main>
    
            <footer style="
              width: 100%;
              max-width: 490px;
              margin: 20px auto 0;
              text-align: center;
              border-top: 1px solid #e6ebf1;
            ">
                <p style="margin: 0; margin-top: 16px; color: #434343;">
                    Copyright © 2024 ${
                      process.env?.WEBSITE_URL
                    } All rights reserved.
                </p>
            </footer>
        </div>
    </body>
    
    </html>`;

  return template;
};

export const formatDateMY = (date: string) => {
  const value = `${MONTHS[parseInt(date.split("-")[1]) - 1]} ${
    date.split("-")[0]
  }`;
  return value;
};

export const formatMonth = (date: string) => {
  const year = date.split("-")[0];
  const month = parseInt(date.split("-")[1]);
  return `${MONTHS[month - 1]} ${year}`;
};

export const generateRandomDate = (startDate: Date, endDate: Date) => {
  const difference = endDate.getTime() - startDate.getTime();
  const randomDifference = Math.random() * difference;
  const randomDate = new Date(startDate.getTime() + randomDifference);
  return randomDate;
};
