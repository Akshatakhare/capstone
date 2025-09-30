import express from 'express';
import auth from '../middlewares/auth.js';
import { recordPayment, listUserPayments } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/', auth, recordPayment);
router.get('/user', auth, listUserPayments);

export default router;
