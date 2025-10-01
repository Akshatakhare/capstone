import Payment from '../models/Payment.js';
import UserPolicy from '../models/UserPolicy.js';
import Claim from '../models/Claim.js';
import { audit } from '../utils/audit.js';

export const recordPayment = async (req, res) => {
  try {
    const userId = req.user.id;
    const { policyId, claimId, amount, method, reference } = req.body;

    // If claimId provided, verify claim is approved and belongs to user
    if (claimId) {
      const claim = await Claim.findById(claimId).populate('userPolicyId');
      if (!claim) return res.status(404).json({ message: 'Claim not found' });
      if (String(claim.userId) !== String(userId)) {
        return res.status(403).json({ message: 'Forbidden' });
      }
      if (claim.status !== 'APPROVED') {
        return res.status(400).json({ message: 'Can only make payments for approved claims' });
      }
      if (claim.paymentRecorded) {
        return res.status(400).json({ message: 'Payment already recorded for this claim' });
      }
    }

    // if policyId provided, verify exists and belongs to user (or admin)
    if (policyId) {
      const up = await UserPolicy.findById(policyId);
      if (!up) return res.status(404).json({ message: 'User policy not found' });
      if (String(up.userId) !== String(userId) && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden' });
      }
    }

    const payment = await Payment.create({ 
      userId, 
      userPolicyId: policyId, 
      claimId: claimId,
      amount, 
      method: method || 'SIMULATED', 
      reference 
    });

    // If this is a claim payment, mark the claim as paid
    if (claimId) {
      await Claim.findByIdAndUpdate(claimId, { paymentRecorded: true });
    }

    audit({ action: 'payment.record', actorId: userId, details: { paymentId: payment._id, claimId } });
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
