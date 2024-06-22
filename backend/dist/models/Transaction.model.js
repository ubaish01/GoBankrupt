"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const contants_1 = require("../config/contants");
const TransactionSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
    type: {
        type: Number,
        enum: Object.values(contants_1.TRANSACTION_TYPE),
    },
    status: {
        type: Number,
        enum: Object.values(contants_1.TRANSACTION_STATUS),
    },
    amount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });
mongoose_1.default.model("Transaction", TransactionSchema);
