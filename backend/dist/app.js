"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("./connection/db");
const express_1 = __importDefault(require("express"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const app = (0, express_1.default)();
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
//ROUTERS IMPORTS
const Auth_route_1 = __importDefault(require("./routes/Auth.route"));
const Game_route_1 = __importDefault(require("./routes/Game.route"));
//CONNECTING DATABASE BEFORE REGISTERING ANY ROUTE
(0, db_1.ConnectDatabase)();
// APP MIDDLEWARES
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, express_session_1.default)({
    secret: "sessionSecret",
    resave: false,
    saveUninitialized: true,
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)());
app.all("/*", function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
});
app.use("/api/v1/auth", Auth_route_1.default);
app.use("/api/v1/game", Game_route_1.default);
app.get("/", (req, res) => {
    return res.json({
        success: true,
        message: "server is running",
    });
});
exports.default = app;
//# sourceMappingURL=app.js.map