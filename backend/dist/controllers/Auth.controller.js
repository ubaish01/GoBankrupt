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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthContollers = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const error_1 = require("../error/error");
const contants_1 = require("../config/contants");
const helperFunctions_1 = require("../helper/helperFunctions");
const services_1 = require("../helper/services");
const User = mongoose_1.default.model("User");
const Wallet = mongoose_1.default.model("Wallet");
const zod_1 = require("zod");
const SignupSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format."),
    name: zod_1.z.string().min(4, "Name must be at least 4 characters long."),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long.")
        .refine((value) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value), {
        message: "Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character (@$!%*?&).",
    }),
});
// Function to validate signup input
function validateSignupInput(data) {
    try {
        // Validate input against the schema
        const validatedData = SignupSchema.parse(data);
        return { success: true, data: validatedData };
    }
    catch (error) {
        return { success: false, error: error.errors };
    }
}
exports.AuthContollers = {
    register: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        try {
            const { email, password, name } = req.body;
            const validation = validateSignupInput(req.body);
            if (!validation.success)
                return (0, error_1.errorHandler)(res, contants_1.STATUS.BAD_REQUEST, ` ${(_b = (_a = validation.error) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message}`);
            console.log(validation);
            if (!email || !password || !name)
                return (0, error_1.errorHandler)(res, contants_1.STATUS.OK, "Input Data missing");
            const userFound = yield User.findOne({
                email: email.toLowerCase(),
                email_verified: true,
            });
            if (userFound)
                return (0, error_1.errorHandler)(res, 400, "Email already exists");
            const salt = 10;
            const hashedPassword = bcrypt_1.default.hashSync(password, salt);
            const subject = "Email verification";
            const otp = (0, helperFunctions_1.generateOTP)();
            const mailTemplate = (0, helperFunctions_1.GenerateOtpMailTemplate)(name, otp);
            const user = new User({
                name: name === null || name === void 0 ? void 0 : name.toLowerCase(),
                email: email.toLowerCase(),
                password: hashedPassword,
                otp,
                last_otp_sent: Date.now(),
                otp_sent_count: 1,
            });
            const _c = user._doc, { password: pwd } = _c, rest = __rest(_c, ["password"]);
            // generating access token for authentication
            yield user.save();
            // sending verification mail
            yield (0, services_1.sendMail)(email, subject, mailTemplate);
            return res.status(201).json({
                success: true,
                user: { _id: user._id, email },
                message: "Otp sent to your email.",
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    login: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { email, password } = req.body;
            const foundUser = yield User.findOne({
                email,
                email_verified: true,
            });
            if (!foundUser)
                return (0, error_1.errorHandler)(res, 404, "User not found");
            const passwordMatch = yield bcrypt_1.default.compare(password, foundUser.password);
            if (!passwordMatch)
                return (0, error_1.errorHandler)(res, 401, "Invalid email or password!");
            const _d = foundUser._doc, { password: pwd, otp, otp_sent_count, last_otp_sent, last_login, last_activity } = _d, rest = __rest(_d, ["password", "otp", "otp_sent_count", "last_otp_sent", "last_login", "last_activity"]);
            const access_token = (0, services_1.generateToken)(foundUser._id);
            (0, services_1.cookieSetter)(res, access_token, true);
            const wallet = yield Wallet.findOne({ user: foundUser._id });
            foundUser.last_login = Date.now();
            foundUser.last_activity = Date.now();
            foundUser.token = access_token;
            yield foundUser.save();
            return res.status(200).json({
                success: true,
                message: "Logged in successfully",
                user: Object.assign({}, rest),
                access_token,
                wallet,
            });
        }
        catch (error) {
            console.error(error);
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    verifyAccount: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userID, otp } = req.body;
            const user = yield User.findById(userID);
            //return error is user not found
            if (!user)
                return (0, error_1.errorHandler)(res, 404, "User not found");
            const otpMatched = otp == user.otp;
            const expired = (0, helperFunctions_1.isOtpExpired)(user.last_otp_sent);
            // if otp did not match or already expired return error message
            if (!otpMatched || expired)
                return (0, error_1.errorHandler)(res, 403, expired ? "Otp is not valid anymore." : "Otp did't matched");
            user.otp = null;
            user.last_login = Date.now();
            user.last_activity = Date.now();
            user.email_verified = true;
            yield user.save();
            const _e = user._doc, { password, otp: otpp, otp_sent_count, last_otp_sent, last_login, last_activity } = _e, rest = __rest(_e, ["password", "otp", "otp_sent_count", "last_otp_sent", "last_login", "last_activity"]);
            const access_token = (0, services_1.generateToken)(user._id);
            (0, services_1.cookieSetter)(res, access_token, true);
            return res.status(200).json({
                success: true,
                message: "Account verified successfully",
                user: Object.assign({}, rest),
                access_token,
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    resendVerificationOtp: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { userId, email, type } = req.body;
            const RESEND_TYPE = {
                VERIFICATION: 1,
                FORGET_PASSWORD: 2,
            };
            const user = yield (type === RESEND_TYPE.FORGET_PASSWORD
                ? User.findOne({ email, email_verified: true })
                : User.findById(userId));
            //return error is user not found
            if (!user)
                return (0, error_1.errorHandler)(res, 404, "User not found");
            // we will only resend the otp if at least 1 minute is passed
            const resendValid = (0, helperFunctions_1.oneMinutePassed)(user.last_otp_sent);
            if (!resendValid)
                return (0, error_1.errorHandler)(res, 400, "Please wait for a minute before resending the otp");
            const otp = (0, helperFunctions_1.generateOTP)();
            const template = type == RESEND_TYPE.FORGET_PASSWORD
                ? (0, helperFunctions_1.GenerateForgetPasswordOtpMailTemplate)(user.name, otp)
                : (0, helperFunctions_1.GenerateOtpMailTemplate)(user.name, otp);
            user.otp = otp;
            user.otp_sent_count += 1;
            user.last_otp_sent = Date.now();
            yield user.save();
            yield (0, services_1.sendMail)(user.email, "OTP - Verify", template);
            return res.status(200).json({
                success: true,
                message: "Otp sent successfully",
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    forgetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const email = req.body.email;
            const user = yield User.findOne({
                email: email.toLowerCase(),
                email_verified: true,
            });
            if (!user)
                return (0, error_1.errorHandler)(res, 404, "user not found");
            const otp = (0, helperFunctions_1.generateOTP)();
            const template = (0, helperFunctions_1.GenerateForgetPasswordOtpMailTemplate)(user.name, otp);
            const subject = "Forget Password";
            yield (0, services_1.sendMail)(user.email, subject, template);
            user.otp = otp;
            user.last_otp_sent = Date.now();
            yield user.save();
            const userData = {
                email: user.email,
                _id: user._id,
            };
            return res.status(200).send({
                success: true,
                message: "Otp sent to the registered email",
                user: userData,
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    verifyOtpForgetPassword: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const { otp, email, password } = req.body;
            const user = yield User.findOne({
                email: email.toLowerCase(),
                email_verified: true,
            });
            if (!user)
                return (0, error_1.errorHandler)(res, 404, "User not found");
            const otpMatched = otp == user.otp;
            const expired = (0, helperFunctions_1.isOtpExpired)(user.last_otp_sent);
            // if otp did not match or already expired return error message
            if (!otpMatched || expired) {
                return res.status(400).json({
                    success: false,
                    message: expired ? "Otp is not valid anymore." : "Otp did't matched",
                });
            }
            const salt = 10;
            const hashdPassword = bcrypt_1.default.hashSync(password, salt);
            user.otp = null;
            user.otp_sent_count += 1;
            user.last_login = Date.now();
            user.last_activity = Date.now();
            user.password = hashdPassword;
            yield user.save();
            const _f = user._doc, { password: pwd, api_calls, otp: otpp, otp_sent_count, last_otp_sent, last_login } = _f, rest = __rest(_f, ["password", "api_calls", "otp", "otp_sent_count", "last_otp_sent", "last_login"]);
            const access_token = (0, services_1.generateToken)(user._id);
            (0, services_1.cookieSetter)(res, access_token, true);
            return res.status(200).json({
                success: true,
                message: "Password changed successfully",
                user: Object.assign({}, rest),
                access_token,
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    logout: (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            (0, services_1.cookieSetter)(res, "", false);
            req.logout(function (err) {
                if (err) {
                    return next(err);
                }
                return res.status(200).json({
                    success: true,
                    message: "Logged out successfully",
                });
            });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    getUser: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (req.user) {
                const foundUser = yield User.findById(req.user._id);
                if (!foundUser)
                    return (0, error_1.errorHandler)(res, 404, "User not found");
                foundUser.last_login = Date.now();
                foundUser.last_activity = Date.now();
                yield foundUser.save();
                const wallet = yield Wallet.findOne({ user: foundUser._id });
                const _g = foundUser._doc, { password: pwd, otp, otp_sent_count, last_otp_sent, last_login, last_activity } = _g, rest = __rest(_g, ["password", "otp", "otp_sent_count", "last_otp_sent", "last_login", "last_activity"]);
                const access_token = (0, services_1.generateToken)(foundUser._id);
                (0, services_1.cookieSetter)(res, access_token, true);
                return res.status(200).json({
                    success: true,
                    message: "Logged in successfully",
                    user: Object.assign({}, rest),
                    wallet,
                    access_token,
                });
            }
            else {
                return (0, error_1.errorHandler)(res, 403, "You are not authenticated");
            }
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
    userOnboard: (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        var _h, _j;
        try {
            const user = yield User.findById(req.user._id);
            console.log(req.body);
            const avatar = parseInt((_h = req.body) === null || _h === void 0 ? void 0 : _h.avatar);
            const balance = parseInt(((_j = req.body) === null || _j === void 0 ? void 0 : _j.balance) || "100000000");
            if (!avatar)
                return (0, error_1.errorHandler)(res, contants_1.STATUS.BAD_REQUEST, "Selecting avatar is mandatory");
            user.avatar = avatar;
            user.onboard = true;
            const wallet = yield Wallet.create({
                user: user._id,
                balance: balance * 100,
            });
            yield user.save();
            const _k = user._doc, { password: pwd, otp, otp_sent_count, last_otp_sent, last_login, last_activity } = _k, rest = __rest(_k, ["password", "otp", "otp_sent_count", "last_otp_sent", "last_login", "last_activity"]);
            return res.json({ success: true, user: Object.assign({}, rest), wallet });
        }
        catch (error) {
            return (0, error_1.errorHandler)(res, contants_1.STATUS.INTERNAL_SERVER_ERROR, error.message);
        }
    }),
};
//# sourceMappingURL=Auth.controller.js.map