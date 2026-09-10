/**
 * Selects Man of the Match from array of player performance ratings
 * 
 * @param {Array} playerPerformances - Array of objects { player, rating, rawScore, stats }
 * @returns {Object|null} Player performance object of MOTM
 */
export const selectManOfTheMatch = (playerPerformances) => {
  if (!playerPerformances || playerPerformances.length === 0) return null;

  const sorted = [...playerPerformances].sort((a, b) => {
    // 1. Higher Rating
    if (b.rating !== a.rating) return b.rating - a.rating;
    // 2. Higher Raw Score
    if (b.rawScore !== a.rawScore) return b.rawScore - a.rawScore;
    // 3. More Goals
    if ((b.stats.goals || 0) !== (a.stats.goals || 0)) return (b.stats.goals || 0) - (a.stats.goals || 0);
    // 4. More Assists
    if ((b.stats.assists || 0) !== (a.stats.assists || 0)) return (b.stats.assists || 0) - (a.stats.assists || 0);
    // 5. More Minutes Played
    return (b.stats.minutesPlayed || 0) - (a.stats.minutesPlayed || 0);
  });

  return sorted[0];
};
