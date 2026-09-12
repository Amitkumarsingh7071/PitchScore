import Match from '../models/Match.js';
import MatchEvent from '../models/MatchEvent.js';
import Player from '../models/Player.js';
import { calculateMatchDetails } from '../services/statsService.js';

// Helper to generate unique 6-character match code
const generateMatchCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'FC-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
};

export const getMatches = async (req, res) => {
  try {
    const matches = await Match.find().sort({ date: -1 }).populate('teamA.playerIds teamB.playerIds');
    
    const enrichedMatches = await Promise.all(
      matches.map(async (m) => {
        const details = await calculateMatchDetails(m._id);
        return {
          _id: m._id,
          matchNumber: m.matchNumber,
          matchCode: m.matchCode,
          creatorId: m.creatorId,
          date: m.date,
          location: m.location,
          duration: m.duration,
          status: m.status,
          teamA: m.teamA,
          teamB: m.teamB,
          score: details.score,
          motm: details.motm ? {
            _id: details.motm.player._id,
            name: details.motm.player.name,
            rating: details.motm.rating
          } : null,
          memory: m.memory,
          notes: m.notes,
          createdAt: m.createdAt,
          completedAt: m.completedAt
        };
      })
    );

    res.json(enrichedMatches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMatchById = async (req, res) => {
  try {
    const details = await calculateMatchDetails(req.params.id);
    res.json(details);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const getMatchByCode = async (req, res) => {
  try {
    const match = await Match.findOne({ matchCode: req.params.code.toUpperCase() }).populate('teamA.playerIds teamB.playerIds');
    if (!match) return res.status(404).json({ message: 'Invalid Match Code. Please check and try again.' });
    
    const details = await calculateMatchDetails(match._id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createMatch = async (req, res) => {
  const { date, location, duration, teamA, teamB, notes } = req.body;

  try {
    const matchCount = await Match.countDocuments();
    let code = generateMatchCode();
    while (await Match.findOne({ matchCode: code })) {
      code = generateMatchCode();
    }

    const match = await Match.create({
      matchNumber: matchCount + 1,
      matchCode: code,
      creatorId: req.user?._id || null,
      date: date || new Date(),
      location: location || 'City Football Turf',
      duration: duration || 90,
      teamA: {
        name: teamA?.name || 'Team Red',
        playerIds: teamA?.playerIds || [],
        playerMinutes: (teamA?.playerIds || []).map(id => ({ playerId: id, minutesPlayed: duration || 90 }))
      },
      teamB: {
        name: teamB?.name || 'Team Blue',
        playerIds: teamB?.playerIds || [],
        playerMinutes: (teamB?.playerIds || []).map(id => ({ playerId: id, minutesPlayed: duration || 90 }))
      },
      status: 'IN_PROGRESS',
      notes: notes || ''
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const joinMatchByCode = async (req, res) => {
  const { matchCode, playerId, newPlayerName, position, jerseyNumber, team } = req.body; // team: 'teamA' | 'teamB'

  try {
    const match = await Match.findOne({ matchCode: matchCode.toUpperCase() });
    if (!match) return res.status(404).json({ message: 'Invalid Match Code' });

    let player;
    if (playerId) {
      player = await Player.findById(playerId);
    } else if (newPlayerName) {
      player = await Player.create({
        name: newPlayerName.trim(),
        position: position || 'Midfielder',
        jerseyNumber: Number(jerseyNumber) || Math.floor(Math.random() * 90) + 1
      });
    }

    if (!player) return res.status(404).json({ message: 'Player profile not found' });

    const pIdStr = player._id.toString();

    // Remove from both teams first to prevent duplicate assignment
    match.teamA.playerIds = match.teamA.playerIds.filter(id => id.toString() !== pIdStr);
    match.teamB.playerIds = match.teamB.playerIds.filter(id => id.toString() !== pIdStr);

    // Add to target team
    if (team === 'teamB') {
      match.teamB.playerIds.push(player._id);
      if (!match.teamB.playerMinutes.some(m => m.playerId.toString() === pIdStr)) {
        match.teamB.playerMinutes.push({ playerId: player._id, minutesPlayed: match.duration });
      }
    } else {
      match.teamA.playerIds.push(player._id);
      if (!match.teamA.playerMinutes.some(m => m.playerId.toString() === pIdStr)) {
        match.teamA.playerMinutes.push({ playerId: player._id, minutesPlayed: match.duration });
      }
    }

    await match.save();
    const details = await calculateMatchDetails(match._id);
    res.json(details);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!match) return res.status(404).json({ message: 'Match not found' });
    res.json(match);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const finishMatch = async (req, res) => {
  const { memory } = req.body;

  try {
    const match = await Match.findById(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    match.status = 'FINISHED';
    match.completedAt = new Date();
    if (memory) {
      match.memory = {
        photoUrl: memory.photoUrl || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
        summary: memory.summary || '',
        bestMoment: memory.bestMoment || '',
        funnyMoment: memory.funnyMoment || '',
        keyTakeaway: memory.keyTakeaway || ''
      };
    }

    await match.save();
    const details = await calculateMatchDetails(match._id);
    res.json(details);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    await MatchEvent.deleteMany({ matchId: req.params.id });
    res.json({ message: 'Match deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
