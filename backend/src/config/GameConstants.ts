interface KeyValuePair {
  [key: number]: number;
}

interface PlinkoConstants {
  TOTAL_DROPS: number;
  MULTIPLIERS_LOW: KeyValuePair;
  MULTIPLIERS_MEDIUM: KeyValuePair;
  MULTIPLIERS_HARD: KeyValuePair;
}

interface MinesConstants {
  TOTAL_DROPS: number;
  BOX_STATE: KeyValuePair;
  MULTIPLIERS_MEDIUM: KeyValuePair;
  MULTIPLIERS_HARD: KeyValuePair;
}

export const MINES_CONSTANTS = {
  BOX_STATE: {
    UNKNOWN: 0,
    MINE: 1,
    GEM: 2,
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
