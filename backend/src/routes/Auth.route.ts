import express from "express";
import passport from "passport";
const router = express.Router();
import { AuthContollers } from "../controllers/Auth.controller";
import { isAuthenticated } from "../middlewares/auth.middlewate";

router.post("/register", AuthContollers.register);
router.post("/login", AuthContollers.login);
router.get("/logout", AuthContollers.logout);
router.post("/account/verify", AuthContollers.verifyAccount);
//@ts-ignore
router.post("/user/onboard", isAuthenticated, AuthContollers.userOnboard);
//@ts-ignore
router.get("/user", AuthContollers.getUser);

router.post("/forget-password", AuthContollers.forgetPassword);
router.post("/otp/resend", AuthContollers.resendVerificationOtp);
router.post("/forget-password/verify", AuthContollers.verifyOtpForgetPassword);

//SOCIAL LOGIN

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);

//@ts-ignore
router.get("/user", AuthContollers.getUser);

export default router;
