import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';
import Player from '../models/Player.js';
import { calculatePlayerMatchRating } from './ratingService.js';
import { selectManOfTheMatch } from './motmService.js';

/**
 * Calculates complete match results, scores, ratings, and MOTM for a given match.
 */
export const calculateMatchDetails = async (matchId) => {
  const match = await Match.findById(matchId).populate('teamA.playerIds teamB.playerIds');
  if (!match) throw new Error('Match not found');

  const events = await MatchEvent.find({ matchId });

  // 1. Calculate Score
  let scoreA = 0;
  let scoreB = 0;

  const teamAPlayerIds = (match.teamA.playerIds || []).map(p => p._id.toString());
  const teamBPlayerIds = (match.teamB.playerIds || []).map(p => p._id.toString());

  events.forEach(e => {
    if (e.type === 'goal') {
      const scorerId = e.playerId.toString();
      if (teamAPlayerIds.includes(scorerId)) scoreA += 1;
      else if (teamBPlayerIds.includes(scorerId)) scoreB += 1;
    }
  });

  const score = { teamA: scoreA, teamB: scoreB };

  // 2. Determine match outcome for teams
  let teamAResult = 'DRAW';
  let teamBResult = 'DRAW';
  if (scoreA > scoreB) {
    teamAResult = 'WIN';
    teamBResult = 'LOSS';
  } else if (scoreB > scoreA) {
    teamAResult = 'LOSS';
    teamBResult = 'WIN';
  }

  // Helper to find player minutes
  const getPlayerMinutes = (pId, playerMinutesArray, duration = 90) => {
    const record = (playerMinutesArray || []).find(m => m.playerId && m.playerId.toString() === pId.toString());
    return record ? record.minutesPlayed : duration;
  };

  // 3. Calculate Player Performance Ratings
  const playerPerformances = [];

  // Process Team A
  (match.teamA.playerIds || []).forEach(player => {
    const mins = getPlayerMinutes(player._id, match.teamA.playerMinutes, match.duration);
    const perf = calculatePlayerMatchRating({
      player,
      events,
      minutesPlayed: mins,
      totalMatchDuration: match.duration,
      result: teamAResult,
      teamGoalsConceded: scoreB
    });
    playerPerformances.push({
      player,
      team: match.teamA.name,
      teamId: 'teamA',
      result: teamAResult,
      ...perf
    });
  });

  // Process Team B
  (match.teamB.playerIds || []).forEach(player => {
    const mins = getPlayerMinutes(player._id, match.teamB.playerMinutes, match.duration);
    const perf = calculatePlayerMatchRating({
      player,
      events,
      minutesPlayed: mins,
      totalMatchDuration: match.duration,
      result: teamBResult,
      teamGoalsConceded: scoreA
    });
    playerPerformances.push({
      player,
      team: match.teamB.name,
      teamId: 'teamB',
      result: teamBResult,
      ...perf
    });
  });

  // 4. Determine MOTM
  const motm = selectManOfTheMatch(playerPerformances);
  const motmPlayerId = motm ? motm.player._id : null;

  return {
    match,
    score,
    teamAResult,
    teamBResult,
    playerPerformances,
    motm,
    motmPlayerId,
    events
  };
};

/**
 * Calculates dynamic career stats for a single player by aggregating across all completed matches and events.
 */
export const calculatePlayerCareerStats = async (playerId) => {
  const player = await Player.findById(playerId);
  if (!player) throw new Error('Player not found');

  const matches = await Match.find({
    status: 'FINISHED',
    $or: [{ 'teamA.playerIds': playerId }, { 'teamB.playerIds': playerId }]
  }).sort({ date: 1 });

  let matchesPlayed = matches.length;
  let goals = 0;
  let assists = 0;
  let motmCount = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let yellowCards = 0;
  let redCards = 0;
  let totalRatingSum = 0;
  let highestRating = 0;

  const matchHistory = [];
  const performanceTrend = [];

  for (const match of matches) {
    const details = await calculateMatchDetails(match._id);
    
    // Find player performance in this match
    const perf = details.playerPerformances.find(
      p => p.player._id.toString() === playerId.toString()
    );

    if (perf) {
      goals += perf.stats.goals;
      assists += perf.stats.assists;
      yellowCards += perf.stats.yellowCards;
      redCards += perf.stats.redCards;
      totalRatingSum += perf.rating;
      if (perf.rating > highestRating) highestRating = perf.rating;

      if (details.motmPlayerId && details.motmPlayerId.toString() === playerId.toString()) {
        motmCount += 1;
      }

      if (perf.result === 'WIN') wins += 1;
      else if (perf.result === 'DRAW') draws += 1;
      else if (perf.result === 'LOSS') losses += 1;

      matchHistory.push({
        matchId: match._id,
        matchNumber: match.matchNumber,
        date: match.date,
        location: match.location,
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        score: details.score,
        result: perf.result,
        rating: perf.rating,
        stats: perf.stats,
        isMotm: details.motmPlayerId && details.motmPlayerId.toString() === playerId.toString()
      });

      performanceTrend.push({
        date: new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        matchNumber: `Match #${match.matchNumber || matchHistory.length}`,
        rating: perf.rating,
        goals: perf.stats.goals,
        assists: perf.stats.assists
      });
    }
  }

  const averageRating = matchesPlayed > 0 ? Number((totalRatingSum / matchesPlayed).toFixed(2)) : 0;
  const goalsPerMatch = matchesPlayed > 0 ? Number((goals / matchesPlayed).toFixed(2)) : 0;
  const assistsPerMatch = matchesPlayed > 0 ? Number((assists / matchesPlayed).toFixed(2)) : 0;
  const winPercentage = matchesPlayed > 0 ? Number(((wins / matchesPlayed) * 100).toFixed(1)) : 0;

  return {
    player,
    careerStats: {
      matchesPlayed,
      goals,
      assists,
      motmCount,
      wins,
      draws,
      losses,
      yellowCards,
      redCards,
      averageRating,
      highestRating,
      goalsPerMatch,
      assistsPerMatch,
      winPercentage
    },
    matchHistory,
    performanceTrend
  };
};

/**
 * Calculates complete global leaderboards dynamically from events and completed matches.
 */
export const calculateLeaderboards = async () => {
  const players = await Player.find();
  const playerStatsList = [];

  for (const player of players) {
    const statsData = await calculatePlayerCareerStats(player._id);
    playerStatsList.push({
      player,
      ...statsData.careerStats
    });
  }

  const topScorers = [...playerStatsList].sort((a, b) => b.goals - a.goals || b.goalsPerMatch - a.goalsPerMatch);
  const topAssists = [...playerStatsList].sort((a, b) => b.assists - a.assists || b.assistsPerMatch - a.assistsPerMatch);
  const mostMotm = [...playerStatsList].sort((a, b) => b.motmCount - a.motmCount || b.averageRating - a.averageRating);
  const highestAvgRating = [...playerStatsList].filter(p => p.matchesPlayed > 0).sort((a, b) => b.averageRating - a.averageRating);
  const mostWins = [...playerStatsList].sort((a, b) => b.wins - a.wins || b.winPercentage - a.winPercentage);
  const bestSingleMatch = [...playerStatsList].filter(p => p.matchesPlayed > 0).sort((a, b) => b.highestRating - a.highestRating);

  return {
    topScorers,
    topAssists,
    mostMotm,
    highestAvgRating,
    mostWins,
    bestSingleMatch
  };
};

/**
 * Calculates overall dashboard summary statistics.
 */
export const calculateDashboardStats = async () => {
  const totalMatches = await Match.countDocuments({ status: 'FINISHED' });
  const totalPlayers = await Player.countDocuments();
  const finishedMatches = await Match.find({ status: 'FINISHED' }).sort({ date: -1 });

  let totalGoals = 0;
  let totalAssists = 0;
  let totalMotm = 0;

  const matchSummaries = [];

  for (const match of finishedMatches) {
    const details = await calculateMatchDetails(match._id);
    totalGoals += (details.score.teamA + details.score.teamB);
    if (details.motmPlayerId) totalMotm += 1;

    // Count assists from events
    details.events.forEach(e => {
      if (e.type === 'assist' || (e.type === 'goal' && e.secondaryPlayerId)) totalAssists += 1;
    });

    matchSummaries.push({
      _id: match._id,
      matchNumber: match.matchNumber,
      date: match.date,
      location: match.location,
      teamA: match.teamA.name,
      teamB: match.teamB.name,
      score: details.score,
      motm: details.motm ? {
        _id: details.motm.player._id,
        name: details.motm.player.name,
        rating: details.motm.rating
      } : null,
      memory: match.memory
    });
  }

  const leaderboards = await calculateLeaderboards();

  return {
    overall: {
      totalMatches,
      totalPlayers,
      totalGoals,
      totalAssists,
      totalMotm
    },
    recentMatches: matchSummaries.slice(0, 5),
    leaderboardPreview: {
      topScorer: leaderboards.topScorers[0] || null,
      topAssists: leaderboards.topAssists[0] || null,
      mostMotm: leaderboards.mostMotm[0] || null,
      highestAvgRating: leaderboards.highestAvgRating[0] || null,
      mostWins: leaderboards.mostWins[0] || null
    }
  };
};
