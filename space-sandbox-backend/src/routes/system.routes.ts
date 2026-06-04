import { Router } from 'express';
import {
  createSystem,
  deleteSystem,
  getSystemById,
  getSystems,
  toggleVisibility,
  updateSystem,
} from '../controllers/system.controller';
import { authenticateJWT } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSystems);
router.get('/:id', authenticateJWT, getSystemById);

router.post('/', authenticateJWT, createSystem);
router.delete('/:id', authenticateJWT, deleteSystem);
router.put('/:id', authenticateJWT, updateSystem);

router.patch('/:id/visibility', authenticateJWT, toggleVisibility);

export default router;
