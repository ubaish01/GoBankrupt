"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomDate = exports.formatMonth = exports.formatDateMY = exports.GenerateForgetPasswordOtpMailTemplate = exports.GenerateOtpMailTemplate = exports.getValidity = exports.currentDate = exports.CreateMineGamePublicState = exports.CreateMineGamePrivateState = exports.generateRandomNumber = exports.isTokenValid = exports.oneMinutePassed = exports.isOtpExpired = exports.generateOTP = exports.extractJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const contants_1 = require("../config/contants");
const GameConstants_1 = require("../config/GameConstants");
const extractJwt = (cookie) => {
    let token = cookie === null || cookie === void 0 ? void 0 : cookie.split("token=");
    if (token)
        token = token[1];
    if (token)
        token = token.split(";");
    if (token)
        token = token[0];
    return token;
};
exports.extractJwt = extractJwt;
const generateOTP = () => {
    var digits = "0123456789";
    let OTP = "";
    for (let i = 0; i < 6; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
};
exports.generateOTP = generateOTP;
const isOtpExpired = (lastOtpSent) => {
    const otpValidityMinutes = 5; // OTP validity duration in minutes
    const currentTime = new Date();
    const timeDifference = Number(currentTime) - Number(lastOtpSent);
    const timeDifferenceMinutes = timeDifference / (1000 * 60);
    return timeDifferenceMinutes > otpValidityMinutes;
};
exports.isOtpExpired = isOtpExpired;
const oneMinutePassed = (lastOtpSent) => {
    const otpValidityMinutes = 1; // OTP validity duration in minutes
    const currentTime = new Date();
    const timeDifference = Number(currentTime) - Number(lastOtpSent);
    const timeDifferenceMinutes = timeDifference / (1000 * 60);
    return timeDifferenceMinutes > otpValidityMinutes;
};
exports.oneMinutePassed = oneMinutePassed;
const isTokenValid = (req) => {
    const cookie = req.headers.cookie;
    if (!cookie)
        return null;
    const token = (0, exports.extractJwt)(cookie);
    if (!token)
        return null;
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "Jfmamjja1");
    if (!decoded)
        return null;
    return decoded === null || decoded === void 0 ? void 0 : decoded._id;
};
exports.isTokenValid = isTokenValid;
const generateRandomNumber = (min = 0, max = 10) => {
    const number = Math.floor(Math.random() * (max - min + 1));
    return number + min;
};
exports.generateRandomNumber = generateRandomNumber;
const CreateMineGamePrivateState = (mines) => {
    var _a, _b;
    const rows = 5, cols = 5;
    const state = [];
    const mineIndex = [];
    while (mineIndex.length < mines) {
        const row = (0, exports.generateRandomNumber)(0, 4);
        const col = (0, exports.generateRandomNumber)(0, 4);
        const includes = (_a = mineIndex.filter((box) => box.row === row && box.col === col)) === null || _a === void 0 ? void 0 : _a.length;
        if (!includes)
            mineIndex.push({ row, col });
    }
    for (let i = 0; i < rows; i++) {
        const currRow = [];
        for (let j = 0; j < cols; j++) {
            const includes = (_b = mineIndex.filter((box) => box.row === i && box.col === j)) === null || _b === void 0 ? void 0 : _b.length;
            if (includes)
                currRow.push(GameConstants_1.MINES_CONSTANTS.BOX_STATE.MINE);
            else
                currRow.push(GameConstants_1.MINES_CONSTANTS.BOX_STATE.GEM);
        }
        state.push(currRow);
    }
    return state;
};
exports.CreateMineGamePrivateState = CreateMineGamePrivateState;
const CreateMineGamePublicState = () => {
    const rows = 5;
    const cols = 5;
    const state = [];
    for (let i = 0; i < rows; i++) {
        const currRow = [];
        for (let j = 0; j < cols; j++)
            currRow.push(GameConstants_1.MINES_CONSTANTS.BOX_STATE.UNKNOWN);
        state.push(currRow);
    }
    return state;
};
exports.CreateMineGamePublicState = CreateMineGamePublicState;
const currentDate = () => {
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
exports.currentDate = currentDate;
const getValidity = (years) => {
    let currentDate = new Date();
    // Add one year to the current date
    currentDate.setFullYear(currentDate.getFullYear() + years);
    return currentDate;
};
exports.getValidity = getValidity;
const GenerateOtpMailTemplate = (username, otp) => {
    var _a;
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
                                <div style="font-size: 2rem;font-weight: 700;">${process.env.WEBSITE_URL}</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${(0, exports.currentDate)()}</span>
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
                            Thank you for choosing ${process.env.COMPANY_NAME} platform. Use the following OTP
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
                        style="color: #499fb6; text-decoration: none;">${process.env.HELP_MAIL}</a>
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
                    Copyright © 2024 ${(_a = process.env) === null || _a === void 0 ? void 0 : _a.WEBSITE_URL} All rights reserved.
                </p>
            </footer>
        </div>
    </body>
    
    </html>`;
    return template;
};
exports.GenerateOtpMailTemplate = GenerateOtpMailTemplate;
const GenerateForgetPasswordOtpMailTemplate = (username, otp) => {
    var _a;
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
                                <div style="font-size: 2rem;font-weight: 700;">${process.env.WEBSITE_URL}</div>
                            </td>
                            <td style="text-align: right;">
                                <span style="font-size: 16px; line-height: 30px; color: #ffffff;">${(0, exports.currentDate)()}</span>
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
                            Thank you for choosing ${process.env.COMPANY_NAME} platform. Use the following OTP
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
                        style="color: #499fb6; text-decoration: none;">${process.env.HELP_MAIL}</a>
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
                    Copyright © 2024 ${(_a = process.env) === null || _a === void 0 ? void 0 : _a.WEBSITE_URL} All rights reserved.
                </p>
            </footer>
        </div>
    </body>
    
    </html>`;
    return template;
};
exports.GenerateForgetPasswordOtpMailTemplate = GenerateForgetPasswordOtpMailTemplate;
const formatDateMY = (date) => {
    const value = `${contants_1.MONTHS[parseInt(date.split("-")[1]) - 1]} ${date.split("-")[0]}`;
    return value;
};
exports.formatDateMY = formatDateMY;
const formatMonth = (date) => {
    const year = date.split("-")[0];
    const month = parseInt(date.split("-")[1]);
    return `${contants_1.MONTHS[month - 1]} ${year}`;
};
exports.formatMonth = formatMonth;
const generateRandomDate = (startDate, endDate) => {
    const difference = endDate.getTime() - startDate.getTime();
    const randomDifference = Math.random() * difference;
    const randomDate = new Date(startDate.getTime() + randomDifference);
    return randomDate;
};
exports.generateRandomDate = generateRandomDate;
//# sourceMappingURL=helperFunctions.js.map