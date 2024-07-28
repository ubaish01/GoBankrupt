"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncError = exports.errorHandler = void 0;
const errorHandler = (res, statusCode = 500, message = "Internal Server Error") => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
exports.errorHandler = errorHandler;
const asyncError = (passedFunc) => (req, res) => {
    return Promise.resolve(passedFunc(req, res)).catch((err) => {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    });
};
exports.asyncError = asyncError;
//# sourceMappingURL=error.js.map