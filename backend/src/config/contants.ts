export const LOGIN_PLATFORM = {
  EMAIL: 1,
  GOOGLE: 2,
  FACEBOOK: 3,
};

export const USER_ROLE = {
  USER: 0,
  ADMIN: 1,
};

export const AVATAR_TYPE = {
  ONE: 1,
  TWO: 2,
  THREE: 3,
  FOUR: 4,
  FIVE: 5,
};

export const TRANSACTION_TYPE = {
  DEBIT: 1,
  CREDIT: 2,
};

export const TRANSACTION_STATUS = {
  PENDING: 1,
  SUCCESS: 2,
  FAILED: 3,
};

export const STATUS = {
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

export const MONTHS = [
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

export const LOCALHOST = "http://localhost:5173";

export const RESPONSE_INFO = {
  TOKEN_ERROR: 1,
};

export const RESEND_TYPE = {
  VERIFICATION: 1,
  FORGET_PASSWORD: 2,
};

export const DEFAULT_BALANCE = 10 * 1000 * 100;

export const BET_RISK = {
  LOW: 1,
  MEDIUM: 2,
  HIGH: 3,
};
