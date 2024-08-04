import { ConnectDatabase } from "./connection/db";
import { LOCALHOST } from "./config/contants";
import express, { Response } from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";
const app = express();
import dotenv from "dotenv";
dotenv.config();

//ROUTERS IMPORTS
import authRouter from "./routes/Auth.route";
import gameRouter from "./routes/Game.route";

//CONNECTING DATABASE BEFORE REGISTERING ANY ROUTE
ConnectDatabase();

// APP MIDDLEWARES
app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(
  cors({
    origin: [
      "https://go-bankrupt-git-main-ubaish01s-projects.vercel.app",
      "https://go-bankrupt.ubaishmalik.in",
    ],
  })
);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/game", gameRouter);
app.get("/", (req, res: Response) => {
  return res.json({
    success: true,
    message: "server is running",
  });
});

export default app;
