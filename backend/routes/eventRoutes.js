import express from 'express';
import { getEventsForMatch, addMatchEvent, updateMatchEvent, deleteMatchEvent } from '../controllers/eventController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/match/:matchId', getEventsForMatch);
router.post('/', protect, adminOnly, addMatchEvent);
router.put('/:id', protect, adminOnly, updateMatchEvent);
router.delete('/:id', protect, adminOnly, deleteMatchEvent);

export default router;
