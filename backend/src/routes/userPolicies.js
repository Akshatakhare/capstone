import express from 'express';
import auth from '../middlewares/auth.js';
import { purchasePolicy, listUserPolicies, cancelUserPolicy } from '../controllers/userPolicyController.js';

const router = express.Router();

// purchase uses policy product id in route
router.post('/:id/purchase', auth, purchasePolicy);

// user policies list (current user)
router.get('/', auth, listUserPolicies);

// cancel
router.put('/:id/cancel', auth, cancelUserPolicy);

export default router;
