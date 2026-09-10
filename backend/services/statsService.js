import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';
import Player from '../models/Player.js';
import { calculatePlayerMatchRating } from './ratingService.js';
import { selectManOfTheMatch } from './motmService.js';

const getCleanId = (item) => {
  if (!item) return '';
  if (typeof item === 'string') return item;
  if (item._id) return item._id.toString();
  return item.toString();
};

export const calculateMatchDetails = async (matchId) => {
  const match = await Match.findById(matchId).populate('teamA.playerIds teamB.playerIds');
  if (!match) throw new Error('Match not found');

  const events = await MatchEvent.find({ matchId });

  let scoreA = 0;
  let scoreB = 0;

  const teamAPlayerIds = (match.teamA?.playerIds || []).filter(Boolean).map(p => getCleanId(p));
  const teamBPlayerIds = (match.teamB?.playerIds || []).filter(Boolean).map(p => getCleanId(p));

  events.forEach(e => {
    if (e.type === 'goal' && e.playerId) {
      const scorerId = getCleanId(e.playerId);
      if (teamAPlayerIds.includes(scorerId)) scoreA += 1;
      else if (teamBPlayerIds.includes(scorerId)) scoreB += 1;
    }
  });

  const score = { teamA: scoreA, teamB: scoreB };

  let teamAResult = 'DRAW';
  let teamBResult = 'DRAW';
  if (scoreA > scoreB) {
    teamAResult = 'WIN';
    teamBResult = 'LOSS';
  } else if (scoreB > scoreA) {
    teamAResult = 'LOSS';
    teamBResult = 'WIN';
  }

  const getPlayerMinutes = (pId, playerMinutesArray, duration = 90) => {
    const pStr = getCleanId(pId);
    const record = (playerMinutesArray || []).find(m => m.playerId && getCleanId(m.playerId) === pStr);
    return record ? record.minutesPlayed : duration;
  };

  const playerPerformances = [];

  (match.teamA?.playerIds || []).filter(Boolean).forEach(player => {
    const mins = getPlayerMinutes(player._id || player, match.teamA.playerMinutes, match.duration);
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

  (match.teamB?.playerIds || []).filter(Boolean).forEach(player => {
    const mins = getPlayerMinutes(player._id || player, match.teamB.playerMinutes, match.duration);
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

  const motm = selectManOfTheMatch(playerPerformances);
  const motmPlayerId = motm ? (motm.player._id || motm.player) : null;

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
  let saves = 0;
  let motmCount = 0;
  let wins = 0;
  let draws = 0;
  let losses = 0;
  let yellowCards = 0;
  let redCards = 0;
  let totalRatingSum = 0;
  let highestRating = 0;

  let maxGoalsInSingleMatch = 0;
  let maxAssistsInSingleMatch = 0;
  let maxSavesInSingleMatch = 0;

  const matchHistory = [];
  const performanceTrend = [];

  for (const match of matches) {
    const details = await calculateMatchDetails(match._id);
    
    const perf = details.playerPerformances.find(
      p => getCleanId(p.player) === playerId.toString()
    );

    if (perf) {
      const matchGoals = perf.stats.goals || 0;
      const matchAssists = perf.stats.assists || 0;
      const matchSaves = perf.stats.saves || 0;

      goals += matchGoals;
      assists += matchAssists;
      saves += matchSaves;
      yellowCards += perf.stats.yellowCards;
      redCards += perf.stats.redCards;
      totalRatingSum += perf.rating;
      
      if (perf.rating > highestRating) highestRating = perf.rating;
      if (matchGoals > maxGoalsInSingleMatch) maxGoalsInSingleMatch = matchGoals;
      if (matchAssists > maxAssistsInSingleMatch) maxAssistsInSingleMatch = matchAssists;
      if (matchSaves > maxSavesInSingleMatch) maxSavesInSingleMatch = matchSaves;

      if (details.motmPlayerId && getCleanId(details.motmPlayerId) === playerId.toString()) {
        motmCount += 1;
      }

      if (perf.result === 'WIN') wins += 1;
      else if (perf.result === 'DRAW') draws += 1;
      else if (perf.result === 'LOSS') losses += 1;

      matchHistory.push({
        matchId: match._id,
        matchNumber: match.matchNumber,
        matchCode: match.matchCode,
        date: match.date,
        location: match.location,
        teamA: match.teamA.name,
        teamB: match.teamB.name,
        score: details.score,
        result: perf.result,
        rating: perf.rating,
        stats: perf.stats,
        isMotm: details.motmPlayerId && getCleanId(details.motmPlayerId) === playerId.toString()
      });

      performanceTrend.push({
        date: new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        matchNumber: `Match #${match.matchNumber || matchHistory.length}`,
        rating: perf.rating,
        goals: matchGoals,
        assists: matchAssists
      });
    }
  }

  const averageRating = matchesPlayed > 0 ? Number((totalRatingSum / matchesPlayed).toFixed(2)) : 0;
  const goalsPerMatch = matchesPlayed > 0 ? Number((goals / matchesPlayed).toFixed(2)) : 0;
  const assistsPerMatch = matchesPlayed > 0 ? Number((assists / matchesPlayed).toFixed(2)) : 0;
  const winPercentage = matchesPlayed > 0 ? Number(((wins / matchesPlayed) * 100).toFixed(1)) : 0;

  const badges = [];
  if (maxGoalsInSingleMatch >= 3) {
    badges.push({ id: 'hat_trick', icon: '🎩', title: 'Hat-Trick Hero', desc: 'Scored 3+ goals in a single match' });
  }
  if (maxAssistsInSingleMatch >= 2) {
    badges.push({ id: 'master_playmaker', icon: '🎯', title: 'Master Playmaker', desc: 'Provided 2+ assists in a single match' });
  }
  if (maxSavesInSingleMatch >= 5 || (player.position === 'Goalkeeper' && matchesPlayed >= 1)) {
    badges.push({ id: 'brick_wall', icon: '🧤', title: 'Brick Wall', desc: 'Made 5+ saves or maintained a clean sheet' });
  }
  if (motmCount >= 1) {
    badges.push({ id: 'turf_mvp', icon: '🏆', title: 'Turf MVP', desc: 'Awarded Man of the Match trophy' });
  }
  if (averageRating >= 8.0 && matchesPlayed >= 1) {
    badges.push({ id: 'elite_performer', icon: '⭐', title: 'Elite Rating', desc: 'Maintains an average rating of 8.0+' });
  }

  return {
    player,
    careerStats: {
      matchesPlayed,
      goals,
      assists,
      saves,
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
      winPercentage,
      badges
    },
    matchHistory,
    performanceTrend
  };
};

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

  const goldenBoot = [...playerStatsList].sort((a, b) => b.goals - a.goals || b.goalsPerMatch - a.goalsPerMatch);
  const goldenGlove = [...playerStatsList].sort((a, b) => b.saves - a.saves || b.averageRating - a.averageRating);
  const topAssists = [...playerStatsList].sort((a, b) => b.assists - a.assists || b.assistsPerMatch - a.assistsPerMatch);
  const mostMotm = [...playerStatsList].sort((a, b) => b.motmCount - a.motmCount || b.averageRating - a.averageRating);
  const highestAvgRating = [...playerStatsList].filter(p => p.matchesPlayed > 0).sort((a, b) => b.averageRating - a.averageRating);
  const mostWins = [...playerStatsList].sort((a, b) => b.wins - a.wins || b.winPercentage - a.winPercentage);

  return {
    topScorers: goldenBoot,
    goldenGlove,
    topAssists,
    mostMotm,
    highestAvgRating,
    mostWins
  };
};

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

    details.events.forEach(e => {
      if (e.type === 'assist' || (e.type === 'goal' && e.secondaryPlayerId)) totalAssists += 1;
    });

    matchSummaries.push({
      _id: match._id,
      matchNumber: match.matchNumber,
      matchCode: match.matchCode,
      date: match.date,
      location: match.location,
      teamA: match.teamA.name,
      teamB: match.teamB.name,
      score: details.score,
      status: match.status,
      motm: details.motm ? {
        _id: details.motm.player._id || details.motm.player,
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
      goldenGlove: leaderboards.goldenGlove[0] || null,
      mostMotm: leaderboards.mostMotm[0] || null,
      highestAvgRating: leaderboards.highestAvgRating[0] || null
    }
  };
};
