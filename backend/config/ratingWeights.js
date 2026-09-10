// Rating algorithm weights & position configs

export const RATING_WEIGHTS = {
  // Base event scores
  GOAL: 4.0,
  ASSIST: 3.0,
  KEY_PASS: 1.0,
  TACKLE: 1.0,
  INTERCEPTION: 1.0,
  SAVE: 1.0,
  PENALTY_SAVE: 3.0,
  YELLOW_CARD: -1.0,
  RED_CARD: -3.0,

  // Position-specific multipliers / additions
  POSITION_BONUSES: {
    Forward: {
      GOAL: 1.1,
      ASSIST: 1.1,
      KEY_PASS: 1.0,
    },
    Midfielder: {
      ASSIST: 1.1,
      KEY_PASS: 1.2,
      TACKLE: 1.1,
      INTERCEPTION: 1.1,
    },
    Defender: {
      TACKLE: 1.2,
      INTERCEPTION: 1.2,
      CLEAN_SHEET: 2.0,
    },
    Goalkeeper: {
      SAVE: 1.2,
      PENALTY_SAVE: 3.5,
      CLEAN_SHEET: 2.5,
      GOAL_CONCEDED: -0.5,
    },
  },

  // Team outcome bonuses
  RESULT_BONUS: {
    WIN: 0.5,
    DRAW: 0.2,
    LOSS: 0.0,
  },

  // Rating scaling parameters
  BASE_RATING: 6.0,
  MIN_RATING: 1.0,
  MAX_RATING: 10.0,
};
