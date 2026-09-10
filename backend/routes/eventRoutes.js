import express from 'express';
import { getEventsForMatch, addMatchEvent, updateMatchEvent, deleteMatchEvent } from '../controllers/eventController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/match/:matchId', getEventsForMatch);
router.post('/', optionalAuth, addMatchEvent);
router.put('/:id', optionalAuth, updateMatchEvent);
router.delete('/:id', optionalAuth, deleteMatchEvent);

export default router;
