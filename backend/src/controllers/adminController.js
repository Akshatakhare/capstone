import User from '../models/User.js';
import UserPolicy from '../models/UserPolicy.js';
import Claim from '../models/Claim.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';

export const summary = async (req, res) => {
  const usersCount = await User.countDocuments();
  const policiesSold = await UserPolicy.countDocuments();
  const claimsPending = await Claim.countDocuments({ status: 'PENDING' });
  const totalPaymentsAgg = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
  const totalPayments = totalPaymentsAgg.length ? totalPaymentsAgg[0].total : 0;

  res.json({ usersCount, policiesSold, claimsPending, totalPayments });
};

export const auditLogs = async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
  res.json(logs);
};
