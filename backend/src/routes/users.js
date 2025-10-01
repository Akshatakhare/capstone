import express from 'express';
import auth from '../middlewares/auth.js';
import { permit } from '../middlewares/permit.js';
import { listUsers } from '../controllers/userController.js';

const router = express.Router();

// Only admin can list all users
router.get('/', auth, permit('admin'), listUsers);

export default router;



