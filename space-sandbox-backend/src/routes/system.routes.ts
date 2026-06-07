import { Router } from 'express';
import {
  cloneSystem,
  createSystem,
  deleteSystem,
  getSystemById,
  getSystems,
  toggleVisibility,
  updateSystem,
} from '../controllers/system.controller';
import { authenticateJWT, optionalAuth } from '../middleware/auth.middleware';

const router = Router();

router.get('/', getSystems);
router.get('/:id', optionalAuth, getSystemById);

router.post('/', authenticateJWT, createSystem);
router.delete('/:id', authenticateJWT, deleteSystem);
router.put('/:id', authenticateJWT, updateSystem);

router.post('/:id/clone', authenticateJWT, cloneSystem);

router.patch('/:id/visibility', authenticateJWT, toggleVisibility);

export default router;
