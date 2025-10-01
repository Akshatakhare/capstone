import UserPolicy from '../models/UserPolicy.js';
import PolicyProduct from '../models/PolicyProduct.js';
import { audit } from '../utils/audit.js';

export const purchasePolicy = async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.id;
    const { startDate, termMonths, nominee } = req.body;

    const product = await PolicyProduct.findById(productId);
    if (!product) return res.status(404).json({ message: 'Policy product not found' });

    const sDate = startDate ? new Date(startDate) : new Date();
    const term = termMonths || product.termMonths || 12;
    const endDate = new Date(sDate);
    endDate.setMonth(endDate.getMonth() + term);

    const premiumPaid = product.premium * (term / (product.termMonths || term));

    const userPolicy = await UserPolicy.create({
      userId,
      policyProductId: productId,
      startDate: sDate,
      endDate,
      premiumPaid,
      nominee
    });

    audit({ action: 'userpolicy.purchase', actorId: userId, details: { userPolicyId: userPolicy._id } });
    res.status(201).json(userPolicy);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const listUserPolicies = async (req, res) => {
  try {
    const query = {};
    if (req.user.role === 'customer') {
      query.userId = req.user.id;
    }
    if (req.user.role === 'agent') {
      query.assignedAgentId = req.user.id;
    }

    const items = await UserPolicy.find(query)
      .populate('policyProductId userId assignedAgentId')
      .lean();
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const cancelUserPolicy = async (req, res) => {
  const userId = req.user.id;
  const policyId = req.params.id;
  const up = await UserPolicy.findOne({ _id: policyId });

  if (!up) return res.status(404).json({ message: 'Not found' });
  if (String(up.userId) !== String(userId) && req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Forbidden' });
  }

  // Business rule: allow cancel if before startDate or within 30 days after start
  const now = new Date();
  const start = new Date(up.startDate);
  const daysSinceStart = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  if (daysSinceStart > 30) return res.status(400).json({ message: 'Cannot cancel after 30 days of start' });

  up.status = 'CANCELLED';
  await up.save();

  audit({ action: 'userpolicy.cancel', actorId: req.user.id, details: { userPolicyId: up._id } });
  res.json({ message: 'cancelled', userPolicy: up });
};
