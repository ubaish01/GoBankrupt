"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.generateToken = exports.cookieSetter = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cookie_1 = require("cookie");
const nodemailer_1 = __importDefault(require("nodemailer"));
const cookieSetter = (res, token, set) => {
    res.setHeader("Set-Cookie", (0, cookie_1.serialize)("token", set ? token : "", {
        path: "/",
        httpOnly: true,
        maxAge: set ? 30 * 24 * 60 * 60 * 1000 : 0,
    }));
};
exports.cookieSetter = cookieSetter;
const generateToken = (_id) => {
    return jsonwebtoken_1.default.sign({ _id }, process.env.JWT_SECRET || "", {
        expiresIn: "30d",
    });
};
exports.generateToken = generateToken;
const sendMail = (to, subject, html) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transporter = nodemailer_1.default.createTransport({
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
        const response = yield transporter.sendMail(details);
    }
    catch (error) {
        console.error(error);
    }
});
exports.sendMail = sendMail;
//# sourceMappingURL=services.js.map