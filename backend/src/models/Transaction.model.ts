import mongoose from "mongoose";
import { TRANSACTION_STATUS, TRANSACTION_TYPE } from "../config/contants";

const TransactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: Number,
      enum: Object.values(TRANSACTION_TYPE),
    },
    status: {
      type: Number,
      enum: Object.values(TRANSACTION_STATUS),
    },
    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

mongoose.model("Transaction", TransactionSchema);
