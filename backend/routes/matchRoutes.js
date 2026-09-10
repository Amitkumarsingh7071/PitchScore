import express from 'express';
import { 
  getMatches, 
  getMatchById, 
  getMatchByCode, 
  createMatch, 
  joinMatchByCode, 
  updateMatch, 
  finishMatch, 
  deleteMatch 
} from '../controllers/matchController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/code/:code', getMatchByCode);
router.get('/:id', getMatchById);
router.post('/', optionalAuth, createMatch);
router.post('/join-code', optionalAuth, joinMatchByCode);
router.put('/:id', optionalAuth, updateMatch);
router.post('/:id/finish', optionalAuth, finishMatch);
router.delete('/:id', optionalAuth, deleteMatch);

export default router;
