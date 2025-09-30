import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import { summary, auditLogs } from '../controllers/adminController.js';

const router = express.Router();
router.get('/summary', auth, permit('admin'), summary);
router.get('/audit', auth, permit('admin'), auditLogs);
export default router;
