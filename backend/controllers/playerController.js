import Player from '../models/Player.js';
import { calculatePlayerCareerStats } from '../services/statsService.js';

export const getPlayers = async (req, res) => {
  try {
    const players = await Player.find().sort({ name: 1 });
    res.json(players);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPlayerById = async (req, res) => {
  try {
    const data = await calculatePlayerCareerStats(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
};

export const createPlayer = async (req, res) => {
  const { name, profileImage, position, jerseyNumber, bio } = req.body;

  try {
    const player = await Player.create({
      name,
      profileImage: profileImage || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=400',
      position,
      jerseyNumber: jerseyNumber || 10,
      bio: bio || ''
    });
    res.status(201).json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json(player);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    if (!player) return res.status(404).json({ message: 'Player not found' });
    res.json({ message: 'Player deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
