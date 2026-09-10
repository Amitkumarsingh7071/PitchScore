import MatchEvent from '../models/MatchEvent.js';
import Match from '../models/Match.js';
import { calculateMatchDetails } from '../services/statsService.js';

export const getEventsForMatch = async (req, res) => {
  try {
    const events = await MatchEvent.find({ matchId: req.params.matchId })
      .sort({ minute: 1, createdAt: 1 })
      .populate('playerId secondaryPlayerId');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addMatchEvent = async (req, res) => {
  const { matchId, type, minute, playerId, secondaryPlayerId, value, details } = req.body;

  try {
    const match = await Match.findById(matchId);
    if (!match) return res.status(404).json({ message: 'Match not found' });

    const event = await MatchEvent.create({
      matchId,
      type,
      minute: minute || 0,
      playerId,
      secondaryPlayerId: secondaryPlayerId || null,
      value: value || 1,
      details: details || ''
    });

    // If goal event with secondary player, also record assist event for explicit tracking
    if (type === 'goal' && secondaryPlayerId) {
      await MatchEvent.create({
        matchId,
        type: 'assist',
        minute: minute || 0,
        playerId: secondaryPlayerId,
        secondaryPlayerId: playerId,
        value: 1,
        details: 'Assisted goal'
      });
    }

    // Return updated live match details
    const updatedDetails = await calculateMatchDetails(matchId);
    res.status(201).json({ event, matchDetails: updatedDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateMatchEvent = async (req, res) => {
  try {
    const event = await MatchEvent.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updatedDetails = await calculateMatchDetails(event.matchId);
    res.json({ event, matchDetails: updatedDetails });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteMatchEvent = async (req, res) => {
  try {
    const event = await MatchEvent.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    const updatedDetails = await calculateMatchDetails(event.matchId);
    res.json({ message: 'Event deleted', matchDetails: updatedDetails });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
