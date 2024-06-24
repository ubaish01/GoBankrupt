interface KeyValuePair {
  [key: number | string]: number;
}

interface PlinkoConstants {
  TOTAL_DROPS: number;
  MULTIPLIERS_LOW: KeyValuePair;
  MULTIPLIERS_MEDIUM: KeyValuePair;
  MULTIPLIERS_HARD: KeyValuePair;
}

interface MinesConstants {
  BOX_STATE: KeyValuePair;
  BET_MULTIPLIER: KeyValuePair;
  BOX_COUNT: number;
}

export const MINES_CONSTANTS: MinesConstants = {
  BOX_STATE: {
    UNKNOWN: 0,
    MINE: 1,
    GEM: 2,
  },

  BET_MULTIPLIER: {
    0: 1,
    1: 1.03,
    2: 1.08,
    3: 1.12,
    4: 1.18,
    5: 1.24,
    6: 1.3,
    7: 1.37,
    8: 1.46,
    9: 1.55,
    10: 1.65,
    11: 1.77,
    12: 1.9,
    13: 2.06,
    14: 2.2,
    15: 2.5,
    16: 2.8,
    17: 3.1,
    18: 3.5,
    19: 4.1,
    20: 5.5,
    21: 7.2,
    22: 8.4,
    23: 10.5,
    24: 15,
  },

  BOX_COUNT: 25,
};

export const PLINKO_CONSTANTS: PlinkoConstants = {
  TOTAL_DROPS: 16,

  MULTIPLIERS_LOW: {
    0: 16,
    1: 9,
    2: 2,
    3: 1.4,
    4: 1.4,
    5: 1.2,
    6: 1.1,
    7: 1,
    8: 0.5,
    9: 1,
    10: 1.1,
    11: 1.2,
    12: 1.4,
    13: 1.4,
    14: 2,
    15: 9,
    16: 16,
  },
  MULTIPLIERS_MEDIUM: {
    0: 110,
    1: 41,
    2: 10,
    3: 5,
    4: 3,
    5: 1.5,
    6: 1,
    7: 0.5,
    8: 0.3,
    9: 0.5,
    10: 1,
    11: 1.5,
    12: 3,
    13: 5,
    14: 10,
    15: 41,
    16: 110,
  },
  MULTIPLIERS_HARD: {
    0: 1000,
    1: 130,
    2: 26,
    3: 9,
    4: 4,
    5: 2,
    6: 0.2,
    7: 0.2,
    8: 0.2,
    9: 0.2,
    10: 0.2,
    11: 2,
    12: 4,
    13: 9,
    14: 26,
    15: 130,
    16: 1000,
  },
};
