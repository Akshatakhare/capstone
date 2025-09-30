import User from '../models/User.js';
import { audit } from '../utils/audit.js';

export const listAgents = async (req, res) => {
  const agents = await User.find({ role: 'agent' }).select('-passwordHash').lean();
  res.json(agents);
};

export const createAgent = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });

  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ message: 'Email exists' });

  // create with role agent
  const bcrypt = (await import('bcryptjs')).default;
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, role: 'agent' });
  audit({ action: 'agent.create', actorId: req.user.id, details: { agentId: user._id } });
  res.status(201).json({ message: 'agent created', agent: { _id: user._id, name: user.name, email: user.email } });
};

export const assignAgent = async (req, res) => {
  const { entity, entityId, agentId } = req.body;
  // entity: 'policy'|'claim' ; entityId: id of userPolicy or claim
  // For simplicity: we support assigning agent to a UserPolicy
  if (!entity || !entityId || !agentId) return res.status(400).json({ message: 'Missing fields' });

  if (!['policy', 'claim'].includes(entity)) return res.status(400).json({ message: 'Invalid entity' });

  if (entity === 'policy') {
    const UserPolicy = (await import('../models/UserPolicy.js')).default;
    const up = await UserPolicy.findById(entityId);
    if (!up) return res.status(404).json({ message: 'UserPolicy not found' });
    up.assignedAgentId = agentId;
    await up.save();
    audit({ action: 'agent.assign', actorId: req.user.id, details: { agentId, userPolicyId: up._id } });
    return res.json({ message: 'agent assigned', userPolicy: up });
  }

  if (entity === 'claim') {
    const Claim = (await import('../models/Claim.js')).default;
    const claim = await Claim.findById(entityId);
    if (!claim) return res.status(404).json({ message: 'Claim not found' });
    claim.decidedByAgentId = agentId;
    await claim.save();
    audit({ action: 'agent.assign', actorId: req.user.id, details: { agentId, claimId: claim._id } });
    return res.json({ message: 'agent assigned to claim', claim });
  }
};
