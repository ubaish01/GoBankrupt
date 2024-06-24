"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const Game_controller_1 = require("../controllers/Game.controller");
const auth_middlewate_1 = require("../middlewares/auth.middlewate");
//@ts-ignore
router.post("/plinkoo", auth_middlewate_1.isAuthenticated, Game_controller_1.Plinkoo);
//@ts-ignore
router.post("/mines/start", auth_middlewate_1.isAuthenticated, Game_controller_1.MineGameController.StartMineGame);
//@ts-ignore
router.post("/mines/box/reveal", auth_middlewate_1.isAuthenticated, Game_controller_1.MineGameController.RevealBox);
//@ts-ignore
router.post("/mines/cashout", auth_middlewate_1.isAuthenticated, Game_controller_1.MineGameController.Cashout);
router.get("/mines/active-game", 
//@ts-ignore
auth_middlewate_1.isAuthenticated, Game_controller_1.MineGameController.GetActiveGame);
exports.default = router;
