import Claim from '../models/Claim.js';
import UserPolicy from '../models/UserPolicy.js';
import { audit } from '../utils/audit.js';

export const submitClaim = async (req, res) => {
  try {
    const userId = req.user.id;
    const { userPolicyId, incidentDate, description, amountClaimed } = req.body;

    // policyId is userPolicy id
    const up = await UserPolicy.findById({_id:userPolicyId , userId});
    if (!up) return res.status(404).json({ message: 'User policy not found' });
    if (String(up.userId) !== String(userId) && req.user.role !== 'customer') {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const claim = await Claim.create({
      userId,
      userPolicyId,
      incidentDate: incidentDate ? new Date(incidentDate) : new Date(),
      description,
      amountClaimed
    });

    audit({ action: 'claim.submit', actorId: userId, details: { claimId: claim._id } });
    res.status(201).json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error'+err.message });
  }
};

export const listClaims = async (req, res) => {
  const { role, id } = req.user;
  let query = {};
  if (role === 'customer') {
    query.userId = id;              // customer sees own claims
  } else if (role === 'agent') {
    query.decidedByAgentId = id;     // agent sees only assigned claims
  }
  const claims = await Claim.find(query)
    .populate('userId userPolicyId decidedByAgentId')
    .lean();
  res.json(claims);
};


export const getClaim = async (req, res) => {
  const claim = await Claim.findById(req.params.id).lean();
  if (!claim) return res.status(404).json({ message: 'Not found' });
  // restrict
  if (req.user.role === 'customer' && String(claim.userId) !== String(req.user.id)) {
    return res.status(403).json({ message: 'Forbidden' });
  }
  res.json(claim);
};

export const updateClaimStatus = async (req, res) => {
  const { status, notes } = req.body;
  const claim = await Claim.findById(req.params.id);
  if (!claim) return res.status(404).json({ message: 'Not found' });

  if (!['PENDING', 'APPROVED', 'REJECTED'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  claim.status = status;
  if (notes) claim.decisionNotes = notes;
  if (req.user.role === 'agent' || req.user.role === 'admin') {
    claim.decidedByAgentId = req.user.id;
  } else {
    return res.status(403).json({ message: 'Forbidden' });
  }

  await claim.save();
  audit({ action: 'claim.updateStatus', actorId: req.user.id, details: { claimId: claim._id, status } });
  res.json(claim);
};
