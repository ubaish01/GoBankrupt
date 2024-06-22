"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const WalletSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'User'
    },
    balance: {
        type: Number,
        default: 0
    }
}, { timestamps: true });
mongoose_1.default.model("Wallet", WalletSchema);
//# sourceMappingURL=Wallet.model.js.map