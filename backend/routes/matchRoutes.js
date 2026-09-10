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
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', getMatches);
router.get('/code/:code', getMatchByCode);
router.get('/:id', getMatchById);
router.post('/', protect, createMatch);
router.post('/join-code', protect, joinMatchByCode);
router.put('/:id', protect, updateMatch);
router.post('/:id/finish', protect, finishMatch);
router.delete('/:id', protect, deleteMatch);

export default router;
