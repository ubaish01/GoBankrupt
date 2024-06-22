import { BET_RISK } from "../config/contants";
import { ModifiedRequest } from "../definitionFile";
import { outcomes } from "../outcomes";
import { Response } from "express";
import mongoose from "mongoose";
const Wallet = mongoose.model("Wallet");
const TOTAL_DROPS = 16;

const MULTIPLIERS_LOW: { [key: number]: number } = {
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
const MULTIPLIERS_MEDIUM: { [key: number]: number } = {
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
const MULTIPLIERS_HARD: { [key: number]: number } = {
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

export const Plinkoo = async (req: ModifiedRequest, res: Response) => {
  try {
    const { bet, risk } = req.body; // bet amount is 500 dollars
    const user = req.user;
    let outcome = 0;
    const pattern = [];
    for (let i = 0; i < TOTAL_DROPS; i++) {
      if (Math.random() > 0.5) {
        pattern.push("R");
        outcome++;
      } else {
        pattern.push("L");
      }
    }

    const multiplier =
      risk == BET_RISK.LOW
        ? MULTIPLIERS_LOW[outcome]
        : risk == BET_RISK.MEDIUM
        ? MULTIPLIERS_MEDIUM[outcome]
        : MULTIPLIERS_HARD[outcome];

    const possiblieOutcomes = outcomes[outcome];
    console.log(multiplier);

    const wallet = await Wallet.findOne({ user: user._id });
    const betAmount = bet > wallet.balance ? wallet.balance : bet;
    wallet.balance -= betAmount;
    const betReward = betAmount * multiplier;
    wallet.balance += betReward;
    await wallet.save();

    res.send({
      point:
        possiblieOutcomes[
          Math.floor(Math.random() * possiblieOutcomes.length || 0)
        ],
      multiplier,
      wallet,
    });
  } catch (error) {
    console.error(error);
  }
};
