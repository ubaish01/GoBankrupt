import mongoose, { mongo } from "mongoose";
import passport from "passport";
import {
  AVATAR_TYPE,
  DEFAULT_BALANCE,
  LOGIN_PLATFORM,
} from "./config/contants";
const GoogleStrategy = require("passport-google-oauth2");
const User = mongoose.model("User");
const bcrypt = require("bcrypt");
const Wallet = mongoose.model("Wallet");
const saltRounds = 10;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      // callbackURL: `${BACKEND_URL}/api/v1/auth/google/callback`,
      callbackURL: `${process.env.BACKEND_URL}/api/v1/auth/google/callback`,
      scope: ["profile", "email"],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: any,
      done: any
    ) => {
      try {
        const hashedPassword = await bcrypt.hash(
          process.env.DEFAULT_PASSWORD,
          saltRounds
        );
        const defaultUser = {
          email: profile.emails[0].value,
          avatar: AVATAR_TYPE.ONE,
          name: profile.name.givenName + " " + profile.name.familyName,
          password: hashedPassword,
          email_verified: true,
          login_platform: LOGIN_PLATFORM.GOOGLE,
        };

        const foundUser = await User.findOne({ email: defaultUser.email });
        if (foundUser) {
          const { password: pwd, ...rest } = foundUser._doc;
          foundUser.last_login = Date.now();
          foundUser.last_activity = Date.now();
          await foundUser.save();
          const {
            password,
            api_calls,
            otp,
            otp_sent_count,
            last_otp_sent,
            last_login,
            ...other
          } = foundUser._doc;

          done(null, other);
          return;
        }

        const newUser = await User.create(defaultUser);
        const {
          password,
          api_calls,
          otp,
          otp_sent_count,
          last_otp_sent,
          last_login,
          ...rest
        } = newUser._doc;

        // await Wallet.create({ user: newUser._id, balance: DEFAULT_BALANCE });

        done(null, rest);
      } catch (error) {
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user: any, done: any) => {
  done(null, user);
});

passport.deserializeUser((user: any, done: any) => {
  done(null, user);
});
