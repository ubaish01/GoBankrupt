import { MINES_CONSTANTS, PLINKO_CONSTANTS } from "../config/GameConstants";
import { BET_RISK, STATUS } from "../config/contants";
import { ModifiedRequest } from "../definitionFile";
import { outcomes } from "../outcomes";
import { Response } from "express";
import mongoose from "mongoose";
import { errorHandler } from "../error/error";
import {
  CreateMineGamePrivateState,
  CreateMineGamePublicState,
} from "../helper/helperFunctions";
const Wallet = mongoose.model("Wallet");
const MineGame = mongoose.model("MineGame");

export const Plinkoo = async (req: ModifiedRequest, res: Response) => {
  try {
    const { bet, risk } = req.body; // bet amount is 500 dollars
    const user = req.user;
    let outcome = 0;
    const pattern = [];
    for (let i = 0; i < PLINKO_CONSTANTS.TOTAL_DROPS; i++) {
      if (Math.random() > 0.5) {
        pattern.push("R");
        outcome++;
      } else {
        pattern.push("L");
      }
    }

    const multiplier =
      risk == BET_RISK.LOW
        ? PLINKO_CONSTANTS.MULTIPLIERS_LOW[outcome]
        : risk == BET_RISK.MEDIUM
        ? PLINKO_CONSTANTS.MULTIPLIERS_MEDIUM[outcome]
        : PLINKO_CONSTANTS.MULTIPLIERS_HARD[outcome];

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

export const StartMineGame = async (req: ModifiedRequest, res: Response) => {
  try {
    const user = req.user;
    const { mines, betAmount } = req.body;
    const wallet = await Wallet.findOne({ user: user._id });

    const activeGame = await MineGame.findOne({ user: user._id });
    const { privateState, ...other } = activeGame._doc;

    if (activeGame)
      return res.status(200).json({
        success: true,
        game: other,
        wallet,
      });

    if (wallet.balance < betAmount)
      return errorHandler(res, STATUS.BAD_REQUEST, "Insufficient balance");

    if (mines > 24 || mines < 1)
      return errorHandler(res, STATUS.BAD_REQUEST, "Mines should be 1 to 24.");

    const gameState = CreateMineGamePublicState();
    const gamePrivateState = CreateMineGamePrivateState(mines);

    const session = await mongoose.startSession();
    try {
      session.startTransaction();
      // Perform your operations within the transaction
      wallet.balance -= Math.floor(betAmount);
      await wallet.save({ session });

      const mineGame = new MineGame({
        user: user._id,
        mines: mines,
        gems: MINES_CONSTANTS.BOX_COUNT - mines,
        isActive: true,
        betAmount,
        state: gameState,
        privateState: gamePrivateState,
      });

      await mineGame.save({ session });

      const { privateState, ...game } = mineGame;

      // Commit the transaction
      await session.commitTransaction();
      const data = {
        success: true,
        wallet,
        game,
      };

      return res.status(STATUS.CREATED).json(data);
    } catch (error: any) {
      await session.abortTransaction();
      console.error("Transaction aborted due to an error: ", error);
      res.status(STATUS.INTERNAL_SERVER_ERROR).json({
        success: true,
        message: error.message,
      });
    } finally {
      session.endSession();
    }
  } catch (error: any) {
    res.status(STATUS.INTERNAL_SERVER_ERROR).json({
      success: true,
      message: error.message,
    });
  }
};
