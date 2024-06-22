import mongoose from "mongoose";
import "../models/Transaction.model";
import "../models/User.model";
import "../models/Wallet.model";

export const ConnectDatabase = () => {
  if (mongoose.connection.readyState === 0) {
    mongoose.connect(process.env.MONGO_URI || "");
    mongoose.connection.on("error", (err) => {
      throw err;
    });

    mongoose.connection.on("connected", () => {
      console.log("⚡ MongoDB Connected ⚡ ");
    });
  }
};
