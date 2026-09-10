import { RATING_WEIGHTS } from '../config/ratingWeights.js';

const getCleanId = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (item._id) return item._id.toString();
  return item.toString();
};

export const calculatePlayerMatchRating = ({
  player,
  events = [],
  minutesPlayed = 90,
  totalMatchDuration = 90,
  result = 'DRAW',
  teamGoalsConceded = 0
}) => {
  const position = player.position || 'Midfielder';
  const posBonus = RATING_WEIGHTS.POSITION_BONUSES[position] || {};
  const playerStr = getCleanId(player);

  let goals = 0;
  let assists = 0;
  let keyPasses = 0;
  let tackles = 0;
  let interceptions = 0;
  let saves = 0;
  let penaltySaves = 0;
  let yellowCards = 0;
  let redCards = 0;

  events.forEach(e => {
    const isPrimary = e.playerId && getCleanId(e.playerId) === playerStr;
    const isSecondaryAssister = e.secondaryPlayerId && getCleanId(e.secondaryPlayerId) === playerStr;

    if (e.type === 'goal' && isPrimary) goals += 1;
    if (e.type === 'assist' && isPrimary) assists += 1;
    if (e.type === 'goal' && isSecondaryAssister) assists += 1;
    if (e.type === 'key_pass' && isPrimary) keyPasses += (e.value || 1);
    if (e.type === 'tackle' && isPrimary) tackles += (e.value || 1);
    if (e.type === 'interception' && isPrimary) interceptions += (e.value || 1);
    if (e.type === 'save' && isPrimary) saves += (e.value || 1);
    if (e.type === 'penalty_save' && isPrimary) penaltySaves += (e.value || 1);
    if (e.type === 'yellow_card' && isPrimary) yellowCards += 1;
    if (e.type === 'red_card' && isPrimary) redCards += 1;
  });

  const goalPts = goals * (RATING_WEIGHTS.GOAL * (posBonus.GOAL || 1.0));
  const assistPts = assists * (RATING_WEIGHTS.ASSIST * (posBonus.ASSIST || 1.0));
  const keyPassPts = keyPasses * (RATING_WEIGHTS.KEY_PASS * (posBonus.KEY_PASS || 1.0));
  const tacklePts = tackles * (RATING_WEIGHTS.TACKLE * (posBonus.TACKLE || 1.0));
  const interceptionPts = interceptions * (RATING_WEIGHTS.INTERCEPTION * (posBonus.INTERCEPTION || 1.0));
  const savePts = saves * (RATING_WEIGHTS.SAVE * (posBonus.SAVE || 1.0));
  const penaltySavePts = penaltySaves * (RATING_WEIGHTS.PENALTY_SAVE * (posBonus.PENALTY_SAVE || 1.0));
  const yellowPts = yellowCards * RATING_WEIGHTS.YELLOW_CARD;
  const redPts = redCards * RATING_WEIGHTS.RED_CARD;

  let cleanSheetPts = 0;
  if (teamGoalsConceded === 0 && minutesPlayed >= 30) {
    if (position === 'Goalkeeper') cleanSheetPts = RATING_WEIGHTS.POSITION_BONUSES.Goalkeeper.CLEAN_SHEET;
    else if (position === 'Defender') cleanSheetPts = RATING_WEIGHTS.POSITION_BONUSES.Defender.CLEAN_SHEET;
  }

  let concededPenaltyPts = 0;
  if (position === 'Goalkeeper') {
    concededPenaltyPts = teamGoalsConceded * RATING_WEIGHTS.POSITION_BONUSES.Goalkeeper.GOAL_CONCEDED;
  }

  let resultPts = RATING_WEIGHTS.RESULT_BONUS[result] || 0;

  const rawScore = 
    goalPts + 
    assistPts + 
    keyPassPts + 
    tacklePts + 
    interceptionPts + 
    savePts + 
    penaltySavePts + 
    yellowPts + 
    redPts + 
    cleanSheetPts + 
    concededPenaltyPts + 
    resultPts;

  let baseRating = RATING_WEIGHTS.BASE_RATING + (rawScore * 0.75);

  const minRatio = Math.min(1.0, Math.max(0.1, minutesPlayed / totalMatchDuration));
  if (minRatio < 0.3) {
    baseRating = 6.0 + (baseRating - 6.0) * (minRatio / 0.3);
  }

  const finalRating = Math.max(RATING_WEIGHTS.MIN_RATING, Math.min(RATING_WEIGHTS.MAX_RATING, baseRating));

  return {
    rawScore: Number(rawScore.toFixed(2)),
    rating: Number(finalRating.toFixed(1)),
    stats: {
      goals,
      assists,
      keyPasses,
      tackles,
      interceptions,
      saves,
      penaltySaves,
      yellowCards,
      redCards,
      minutesPlayed
    }
  };
};
