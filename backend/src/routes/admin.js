import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import { summary, auditLogs, getAgents, getUserPolicies, assignAgent } from '../controllers/adminController.js';

const router = express.Router();
router.get('/summary', auth, permit('admin'), summary);
router.get('/audit', auth, permit('admin'), auditLogs);
router.get('/agents', auth, permit('admin'), getAgents);
router.get('/user-policies', auth, permit('admin'), getUserPolicies);
router.post('/assign-agent', auth, permit('admin'), assignAgent);
export default router;
