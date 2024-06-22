"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BET_RISK = exports.DEFAULT_BALANCE = exports.RESEND_TYPE = exports.RESPONSE_INFO = exports.LOCALHOST = exports.MONTHS = exports.STATUS = exports.TRANSACTION_STATUS = exports.TRANSACTION_TYPE = exports.AVATAR_TYPE = exports.USER_ROLE = exports.LOGIN_PLATFORM = void 0;
exports.LOGIN_PLATFORM = {
    EMAIL: 1,
    GOOGLE: 2,
    FACEBOOK: 3,
};
exports.USER_ROLE = {
    USER: 0,
    ADMIN: 1,
};
exports.AVATAR_TYPE = {
    ONE: 1,
    TWO: 2,
    THREE: 3,
    FOUR: 4,
    FIVE: 5,
};
exports.TRANSACTION_TYPE = {
    DEBIT: 1,
    CREDIT: 2,
};
exports.TRANSACTION_STATUS = {
    PENDING: 1,
    SUCCESS: 2,
    FAILED: 3,
};
exports.STATUS = {
    CREATED: 201,
    OK: 200,
    ACCEPTED: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    PAYMENT_REQUIRED: 402,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    NOT_ALLOWED: 405,
    UNSUPPORTED_MEDIA_TYPE: 415,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
};
exports.MONTHS = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];
exports.LOCALHOST = "http://localhost:5173";
exports.RESPONSE_INFO = {
    TOKEN_ERROR: 1,
};
exports.RESEND_TYPE = {
    VERIFICATION: 1,
    FORGET_PASSWORD: 2,
};
exports.DEFAULT_BALANCE = 10 * 1000 * 100;
exports.BET_RISK = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3,
};
//# sourceMappingURL=contants.js.map