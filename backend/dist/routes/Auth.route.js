"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
const Auth_controller_1 = require("../controllers/Auth.controller");
const auth_middlewate_1 = require("../middlewares/auth.middlewate");
router.post("/register", Auth_controller_1.AuthContollers.register);
router.post("/login", Auth_controller_1.AuthContollers.login);
router.get("/logout", Auth_controller_1.AuthContollers.logout);
router.post("/account/verify", Auth_controller_1.AuthContollers.verifyAccount);
//@ts-ignore
router.post("/user/onboard", auth_middlewate_1.isAuthenticated, Auth_controller_1.AuthContollers.userOnboard);
//@ts-ignore
router.get("/user", Auth_controller_1.AuthContollers.getUser);
router.post("/forget-password", Auth_controller_1.AuthContollers.forgetPassword);
router.post("/otp/resend", Auth_controller_1.AuthContollers.resendVerificationOtp);
router.post("/forget-password/verify", Auth_controller_1.AuthContollers.verifyOtpForgetPassword);
//SOCIAL LOGIN
router.get("/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport_1.default.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
}));
//@ts-ignore
router.get("/user", Auth_controller_1.AuthContollers.getUser);
exports.default = router;
//# sourceMappingURL=Auth.route.js.map