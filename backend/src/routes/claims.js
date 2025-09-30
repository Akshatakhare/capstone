import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import {
  submitClaim,
  listClaims,
  getClaim,
  updateClaimStatus
} from '../controllers/claimController.js';

const router = express.Router();

router.post('/', auth, submitClaim);
router.get('/', auth, listClaims);
router.get('/:id', auth, getClaim);

// agent or admin can update status
router.put('/:id/status', auth, permit('agent', 'admin'), updateClaimStatus);

export default router;
