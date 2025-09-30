import Payment from '../models/Payment.js';
import UserPolicy from '../models/UserPolicy.js';
import { audit } from '../utils/audit.js';

export const recordPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { policyId, amount, method, reference } = req.body;

    // if policyId provided, verify exists and belongs to user (or admin)
    if (policyId) {
      const up = await UserPolicy.findById(policyId);
      if (!up) return res.status(404).json({ message: 'User policy not found' });
      if (String(up.userId) !== String(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const payment = await Payment.create({ userId, userPolicyId: policyId, amount, method: method || 'SIMULATED', reference });
    audit({ action: 'payment.record', actorId: userId, details: { paymentId: payment._id } });
    res.status(201).json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listUserPayments = async (req, res) => {
  const userId = req.user.id;
  const items = await Payment.find({ userId }).populate('userPolicyId').lean();
  res.json(items);
};
