import User from '../models/User.js';
import UserPolicy from '../models/UserPolicy.js';
import Claim from '../models/Claim.js';
import Payment from '../models/Payment.js';
import AuditLog from '../models/AuditLog.js';

export const summary = async (req, res) => {
  try {
    // User counts by role
    const totalUsers = await User.countDocuments();
    const customersCount = await User.countDocuments({ role: 'customer' });
    const agentsCount = await User.countDocuments({ role: 'agent' });
    const adminsCount = await User.countDocuments({ role: 'admin' });

    // Policy counts
    const totalPoliciesSold = await UserPolicy.countDocuments();
    const activePolicies = await UserPolicy.countDocuments({ status: 'ACTIVE' });
    const assignedPolicies = await UserPolicy.countDocuments({ assignedAgentId: { $exists: true, $ne: null } });
    const unassignedPolicies = totalPoliciesSold - assignedPolicies;

    // Claim counts
    const totalClaims = await Claim.countDocuments();
    const pendingClaims = await Claim.countDocuments({ status: 'PENDING' });
    const approvedClaims = await Claim.countDocuments({ status: 'APPROVED' });
    const rejectedClaims = await Claim.countDocuments({ status: 'REJECTED' });

    // Revenue calculations
    const userPolicies = await UserPolicy.find().lean();
    const totalRevenue = userPolicies.reduce((sum, policy) => sum + (policy.premiumPaid || 0), 0);
    
    const claims = await Claim.find().lean();
    const totalClaimAmount = claims.reduce((sum, claim) => sum + (claim.amountClaimed || 0), 0);
    const approvedClaimAmount = claims.filter(c => c.status === 'APPROVED').reduce((sum, c) => sum + (c.amountClaimed || 0), 0);

    // Payment counts
    const totalPayments = await Payment.countDocuments();
    const totalPaymentAmount = await Payment.aggregate([{ $group: { _id: null, total: { $sum: '$amount' } } }]);
    const paymentAmount = totalPaymentAmount.length ? totalPaymentAmount[0].total : 0;

    res.json({
      users: {
        total: totalUsers,
        customers: customersCount,
        agents: agentsCount,
        admins: adminsCount
      },
      policies: {
        total: totalPoliciesSold,
        active: activePolicies,
        assigned: assignedPolicies,
        unassigned: unassignedPolicies
      },
      claims: {
        total: totalClaims,
        pending: pendingClaims,
        approved: approvedClaims,
        rejected: rejectedClaims
      },
      revenue: {
        total: totalRevenue,
        claims: totalClaimAmount,
        approvedClaims: approvedClaimAmount,
        payments: paymentAmount
      },
      payments: {
        total: totalPayments,
        amount: paymentAmount
      }
    });
  } catch (err) {
    console.error('Error in admin summary:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const auditLogs = async (req, res) => {
  const limit = parseInt(req.query.limit || '20', 10);
  const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(limit).lean();
  res.json(logs);
};

export const getAgents = async (req, res) => {
  try {
    const agents = await User.find({ role: 'agent' }).select('_id name email').lean();
    res.json(agents);
  } catch (err) {
    console.error('Error fetching agents:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserPolicies = async (req, res) => {
  try {
    const userPolicies = await UserPolicy.find()
      .populate('userId policyProductId assignedAgentId')
      .lean();
    res.json(userPolicies);
  } catch (err) {
    console.error('Error fetching user policies:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const assignAgent = async (req, res) => {
  try {
    const { entity, entityId, agentId } = req.body;
    
    if (entity === 'policy') {
      const userPolicy = await UserPolicy.findById(entityId);
      if (!userPolicy) {
        return res.status(404).json({ message: 'Policy not found' });
      }
      
      // Verify agent exists
      const agent = await User.findById(agentId);
      if (!agent || agent.role !== 'agent') {
        return res.status(400).json({ message: 'Invalid agent' });
      }
      
      userPolicy.assignedAgentId = agentId;
      await userPolicy.save();
      
      res.json({ message: 'Agent assigned successfully', userPolicy });
    } else {
      res.status(400).json({ message: 'Invalid entity type' });
    }
  } catch (err) {
    console.error('Error assigning agent:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
