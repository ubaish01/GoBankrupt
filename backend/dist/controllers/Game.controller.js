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
exports.Plinkoo = void 0;
const contants_1 = require("../config/contants");
const outcomes_1 = require("../outcomes");
const mongoose_1 = __importDefault(require("mongoose"));
const Wallet = mongoose_1.default.model("Wallet");
const TOTAL_DROPS = 16;
const MULTIPLIERS_LOW = {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16,
};
const MULTIPLIERS_MEDIUM = {
    0: 110,
    1: 41,
    2: 10,
    3: 5,
    4: 3,
    5: 1.5,
    6: 1,
    7: 0.5,
    8: 0.3,
    9: 0.5,
    10: 1,
    11: 1.5,
    12: 3,
    13: 5,
    14: 10,
    15: 41,
    16: 110,
};
const MULTIPLIERS_HARD = {
    0: 1000,
    1: 130,
    2: 26,
    3: 9,
    4: 4,
    5: 2,
    6: 0.2,
    7: 0.2,
    8: 0.2,
    9: 0.2,
    10: 0.2,
    11: 2,
    12: 4,
    13: 9,
    14: 26,
    15: 130,
    16: 1000,
};
const Plinkoo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bet, risk } = req.body; // bet amount is 500 dollars
        const user = req.user;
        let outcome = 0;
        const pattern = [];
        for (let i = 0; i < TOTAL_DROPS; i++) {
            if (Math.random() > 0.5) {
                pattern.push("R");
                outcome++;
            }
            else {
                pattern.push("L");
            }
        }
        const multiplier = risk == contants_1.BET_RISK.LOW
            ? MULTIPLIERS_LOW[outcome]
            : risk == contants_1.BET_RISK.MEDIUM
                ? MULTIPLIERS_MEDIUM[outcome]
                : MULTIPLIERS_HARD[outcome];
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
