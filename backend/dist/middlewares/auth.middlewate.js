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
exports.ExtractUser = exports.isAdmin = exports.isAuthenticated = void 0;
const helperFunctions_1 = require("../helper/helperFunctions");
const contants_1 = require("../config/contants");
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_1 = require("../error/error");
const User = mongoose_1.default.model("User");
const isAuthenticated = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, helperFunctions_1.isTokenValid)(req);
        if (!userId)
            return res.status(contants_1.STATUS.UNAUTHORIZED).json({
                success: false,
                message: "You are not logged in.",
                response_info: contants_1.RESPONSE_INFO.TOKEN_ERROR,
            });
        const user = yield User.findById(userId);
        if (!user)
            return res.status(contants_1.STATUS.UNAUTHORIZED).json({
                success: false,
                message: "You are not logged in.",
                response_info: contants_1.RESPONSE_INFO.TOKEN_ERROR,
            });
        req.user = user;
        next();
    }
    catch (error) {
        console.log(error.message);
        return res.status(contants_1.STATUS.UNAUTHORIZED).json({
            success: false,
            message: "You are not authenticated",
            response_info: contants_1.RESPONSE_INFO.TOKEN_ERROR,
        });
    }
});
exports.isAuthenticated = isAuthenticated;
const isAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const cookie = req.headers.cookie;
        if (!cookie)
            return (0, error_1.errorHandler)(res, contants_1.STATUS.UNAUTHORIZED, "You are not authenticated");
        const token = (0, helperFunctions_1.extractJwt)(cookie);
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        const user = yield User.findById(decoded._id);
        if (!user)
            return (0, error_1.errorHandler)(res, contants_1.STATUS.NOT_ALLOWED, "Token is not valid");
        if (user.role !== contants_1.USER_ROLE.ADMIN)
            return (0, error_1.errorHandler)(res, contants_1.STATUS.NOT_ALLOWED, "You are not allowed to use this route");
        req.user = user;
        next();
    }
    catch (error) {
        return (0, error_1.errorHandler)(res, contants_1.STATUS.UNAUTHORIZED, "You are not authenticated");
    }
});
exports.isAdmin = isAdmin;
const ExtractUser = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = (0, helperFunctions_1.isTokenValid)(req);
        if (!userId)
            return null;
        const user = yield User.findById(userId);
        if (!user)
            return null;
        return user;
    }
    catch (error) {
        return null;
    }
});
exports.ExtractUser = ExtractUser;
//# sourceMappingURL=auth.middlewate.js.map