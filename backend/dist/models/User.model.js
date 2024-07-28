"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contants_1 = require("../config/contants");
const UserSchema = new mongoose_1.default.Schema({
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
        default: contants_1.USER_ROLE.USER,
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
        default: contants_1.LOGIN_PLATFORM.EMAIL,
    },
    token: {
        type: String,
        default: null,
    },
}, { timestamps: true });
mongoose_1.default.model("User", UserSchema);
//# sourceMappingURL=User.model.js.map