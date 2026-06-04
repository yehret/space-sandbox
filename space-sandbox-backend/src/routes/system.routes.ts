import { Router } from 'express';
import {
  createSystem,
  deleteSystem,
  getSystemById,
  getSystems,
  updateSystem,
} from '../controllers/system.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSystems);
router.get('/:id', authenticateJWT, getSystemById);

router.post('/', authenticateJWT, createSystem);
router.delete('/:id', authenticateJWT, deleteSystem);
router.put('/:id', authenticateJWT, updateSystem);

export default router;
