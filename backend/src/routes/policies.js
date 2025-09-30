import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import {
  listPolicies,
  getPolicy,
  createPolicy,
  updatePolicy,
  deletePolicy
} from '../controllers/policyController.js';

const router = express.Router();

router.get('/', listPolicies);
router.get('/:id', getPolicy);
router.post('/', auth, permit('admin'), createPolicy);
router.put('/:id', auth, permit('admin'), updatePolicy);
router.delete('/:id', auth, permit('admin'), deletePolicy);

export default router;
