import express from "express";
const router = express.Router();
import { MineGameController, Plinkoo } from "../controllers/Game.controller";
import { isAuthenticated } from "../middlewares/auth.middlewate";

//@ts-ignore
router.post("/plinkoo", isAuthenticated, Plinkoo);

//@ts-ignore
router.post("/mines/start", isAuthenticated, MineGameController.StartMineGame);
//@ts-ignore
router.post("/mines/box/reveal", isAuthenticated, MineGameController.RevealBox);
//@ts-ignore
router.post("/mines/cashout", isAuthenticated, MineGameController.Cashout);
router.get(
  "/mines/active-game",
  //@ts-ignore
  isAuthenticated,
  MineGameController.GetActiveGame
);

export default router;
