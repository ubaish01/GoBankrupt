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
const mongoose_1 = __importDefault(require("mongoose"));
const passport_1 = __importDefault(require("passport"));
const contants_1 = require("./config/contants");
const GoogleStrategy = require("passport-google-oauth2");
const User = mongoose_1.default.model("User");
const bcrypt = require("bcrypt");
const Wallet = mongoose_1.default.model("Wallet");
const saltRounds = 10;
passport_1.default.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    // callbackURL: `${BACKEND_URL}/api/v1/auth/google/callback`,
    callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
    scope: ["profile", "email"],
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt.hash(process.env.DEFAULT_PASSWORD, saltRounds);
        const defaultUser = {
            email: profile.emails[0].value,
            avatar: contants_1.AVATAR_TYPE.ONE,
            name: profile.name.givenName + " " + profile.name.familyName,
            password: hashedPassword,
            email_verified: true,
            login_platform: contants_1.LOGIN_PLATFORM.GOOGLE,
        };
        const foundUser = yield User.findOne({ email: defaultUser.email });
        if (foundUser) {
            const _a = foundUser._doc, { password: pwd } = _a, rest = __rest(_a, ["password"]);
            foundUser.last_login = Date.now();
            foundUser.last_activity = Date.now();
            yield foundUser.save();
            const _b = foundUser._doc, { password, api_calls, otp, otp_sent_count, last_otp_sent, last_login } = _b, other = __rest(_b, ["password", "api_calls", "otp", "otp_sent_count", "last_otp_sent", "last_login"]);
            done(null, other);
            return;
        }
        const newUser = yield User.create(defaultUser);
        const _c = newUser._doc, { password, api_calls, otp, otp_sent_count, last_otp_sent, last_login } = _c, rest = __rest(_c, ["password", "api_calls", "otp", "otp_sent_count", "last_otp_sent", "last_login"]);
        // await Wallet.create({ user: newUser._id, balance: DEFAULT_BALANCE });
        done(null, rest);
    }
    catch (error) {
        done(error, false);
    }
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    done(null, user);
});
//# sourceMappingURL=passport.js.map