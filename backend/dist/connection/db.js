"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConnectDatabase = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
require("../models/Transaction.model");
require("../models/User.model");
require("../models/Wallet.model");
const ConnectDatabase = () => {
    if (mongoose_1.default.connection.readyState === 0) {
        mongoose_1.default.connect(process.env.MONGO_URI || "");
        mongoose_1.default.connection.on("error", (err) => {
            throw err;
        });
        mongoose_1.default.connection.on("connected", () => {
            console.log("⚡ MongoDB Connected ⚡ ");
        });
    }
};
exports.ConnectDatabase = ConnectDatabase;
//# sourceMappingURL=db.js.map