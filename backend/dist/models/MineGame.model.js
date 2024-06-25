"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
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
}, { timestamps: true });
mongoose_1.default.model("MineGame", Schema);
//# sourceMappingURL=MineGame.model.js.map