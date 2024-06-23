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
exports.StartMineGame = exports.Plinkoo = void 0;
const GameConstants_1 = require("../config/GameConstants");
const contants_1 = require("../config/contants");
const outcomes_1 = require("../outcomes");
const mongoose_1 = __importDefault(require("mongoose"));
const error_1 = require("../error/error");
const helperFunctions_1 = require("../helper/helperFunctions");
const Wallet = mongoose_1.default.model("Wallet");
const MineGame = mongoose_1.default.model("MineGame");
const Plinkoo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bet, risk } = req.body; // bet amount is 500 dollars
        const user = req.user;
        let outcome = 0;
        const pattern = [];
        for (let i = 0; i < GameConstants_1.PLINKO_CONSTANTS.TOTAL_DROPS; i++) {
            if (Math.random() > 0.5) {
                pattern.push("R");
                outcome++;
            }
            else {
                pattern.push("L");
            }
        }
        const multiplier = risk == contants_1.BET_RISK.LOW
            ? GameConstants_1.PLINKO_CONSTANTS.MULTIPLIERS_LOW[outcome]
            : risk == contants_1.BET_RISK.MEDIUM
                ? GameConstants_1.PLINKO_CONSTANTS.MULTIPLIERS_MEDIUM[outcome]
                : GameConstants_1.PLINKO_CONSTANTS.MULTIPLIERS_HARD[outcome];
        const possiblieOutcomes = outcomes_1.outcomes[outcome];
        console.log(multiplier);
        const wallet = yield Wallet.findOne({ user: user._id });
        const betAmount = bet > wallet.balance ? wallet.balance : bet;
        wallet.balance -= betAmount;
        const betReward = betAmount * multiplier;
        wallet.balance += betReward;
        yield wallet.save();
        res.send({
            point: possiblieOutcomes[Math.floor(Math.random() * possiblieOutcomes.length || 0)],
            multiplier,
            wallet,
        });
    }
    catch (error) {
        console.error(error);
    }
});
exports.Plinkoo = Plinkoo;
const StartMineGame = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const session = yield mongoose_1.default.startSession();
    try {
        const user = req.user;
        const { mines, betAmount } = req.body;
        const wallet = yield Wallet.findOne({ user: user._id });
        if (wallet.balance < betAmount)
            return (0, error_1.errorHandler)(res, contants_1.STATUS.BAD_REQUEST, "Insufficient balance");
        if (mines > 24 || mines < 1)
            return (0, error_1.errorHandler)(res, contants_1.STATUS.BAD_REQUEST, "Mines should be 1 to 24.");
        const gameState = (0, helperFunctions_1.CreateMineGamePublicState)();
        const gamePrivateState = (0, helperFunctions_1.CreateMineGamePrivateState)(mines);
        session.startTransaction();
        // Perform your operations within the transaction
        wallet.balance -= Math.floor(betAmount);
        yield wallet.save({ session });
        const mineGame = new MineGame({
            user: user._id,
            mines: mines,
            gems: GameConstants_1.MINES_CONSTANTS.BOX_COUNT - mines,
            isActive: true,
            betAmount,
            state: gameState,
            privateState: gamePrivateState,
        });
        yield mineGame.save({ session });
        const { privateState } = mineGame, game = __rest(mineGame, ["privateState"]);
        // Commit the transaction
        yield session.commitTransaction();
        const data = {
            success: true,
            wallet,
            mineGame: game,
        };
        return res.status(contants_1.STATUS.CREATED).json(data);
    }
    catch (error) {
        yield session.abortTransaction();
        console.error("Transaction aborted due to an error: ", error);
        res.status(contants_1.STATUS.INTERNAL_SERVER_ERROR).json({
            success: true,
            message: error.message,
        });
    }
    finally {
        session.endSession();
    }
});
exports.StartMineGame = StartMineGame;
