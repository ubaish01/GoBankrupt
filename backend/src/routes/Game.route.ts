import express from "express";
const router = express.Router();
import { Plinkoo } from "../controllers/Game.controller";
import { isAuthenticated } from "../middlewares/auth.middlewate";

//@ts-ignore
router.post("/plinkoo", isAuthenticated, Plinkoo);

export default router;
