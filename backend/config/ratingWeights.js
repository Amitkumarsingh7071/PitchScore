// Realistic Football Rating System (Baseline 6.5, gradual progression to 10.0)

export const RATING_WEIGHTS = {
  // Base event rating increments
  GOAL: 0.9,
  ASSIST: 0.6,
  KEY_PASS: 0.25,
  TACKLE: 0.15,
  INTERCEPTION: 0.15,
  SAVE: 0.25,
  PENALTY_SAVE: 1.0,
  YELLOW_CARD: -0.4,
  RED_CARD: -1.5,
  OWN_GOAL: -0.8,

  // Position-specific multipliers / bonuses
  POSITION_BONUSES: {
    Forward: {
      GOAL: 1.0,
      ASSIST: 1.0,
      KEY_PASS: 1.0,
    },
    Midfielder: {
      GOAL: 1.1,
      ASSIST: 1.1,
      KEY_PASS: 1.2,
      TACKLE: 1.1,
      INTERCEPTION: 1.1,
    },
    Defender: {
      GOAL: 1.3,
      ASSIST: 1.2,
      TACKLE: 1.2,
      INTERCEPTION: 1.2,
      CLEAN_SHEET: 0.4,
    },
    Goalkeeper: {
      GOAL: 2.0,
      ASSIST: 1.5,
      SAVE: 1.1,
      PENALTY_SAVE: 1.2,
      CLEAN_SHEET: 0.5,
      GOAL_CONCEDED: -0.2,
    },
  },

  // Team outcome bonuses
  RESULT_BONUS: {
    WIN: 0.2,
    DRAW: 0.1,
    LOSS: 0.0,
  },

  // Rating scaling bounds
  BASE_RATING: 6.5,
  MIN_RATING: 1.0,
  MAX_RATING: 10.0,
};
