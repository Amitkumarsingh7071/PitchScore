import express from 'express';
import { getPlayers, getPlayerById, createPlayer, updatePlayer, deletePlayer } from '../controllers/playerController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getPlayers);
router.get('/:id', getPlayerById);
router.post('/', optionalAuth, createPlayer);
router.put('/:id', optionalAuth, updatePlayer);
router.delete('/:id', optionalAuth, deletePlayer);

export default router;
