import mongoose from "mongoose";

const Schema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    mines: {
      type: Number,
      required: true,
    },
    gems: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    betAmount: {
      type: Number,
      required: true,
    },
    multiplier: {
      type: Number,
      default: 1,
    },
    state: {
      type: Array,
      required: true,
    },

    privateState: {
      type: Array,
      required: true,
    },

    opened: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

mongoose.model("MineGame", Schema);
