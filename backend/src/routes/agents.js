import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import { listAgents, createAgent, assignAgent } from '../controllers/agentController.js';

const router = express.Router();
//So admin can create agents, assign them, etc. Agents can’t hit these endpoint
router.get('/', auth, permit('admin'), listAgents);
router.post('/', auth, permit('admin'), createAgent);
router.put('/:id/assign', auth, permit('admin'), assignAgent);

export default router;
