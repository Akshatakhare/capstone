import PolicyProduct from '../models/PolicyProduct.js';
import { audit } from '../utils/audit.js';

export const listPolicies = async (req, res) => {
  const policies = await PolicyProduct.find().lean();
  res.json(policies);
};

export const getPolicy = async (req, res) => {
  const policy = await PolicyProduct.findById(req.params.id);
  if (!policy) return res.status(404).json({ message: 'Not found' });
  res.json(policy);
};

export const createPolicy = async (req, res) => {
  const { code, title, description, premium, termMonths, minSumInsured } = req.body;
  if (!code || !title || !premium) return res.status(400).json({ message: 'Missing fields' });
  const existing = await PolicyProduct.findOne({ code });
  if (existing) return res.status(409).json({ message: 'Code exists' });
  const policy = await PolicyProduct.create({ code, title, description, premium, termMonths, minSumInsured });
  audit({ action: 'policy.create', actorId: req.user?.id, details: { policyId: policy._id } });
  res.status(201).json(policy);
};

export const updatePolicy = async (req, res) => {
  const policy = await PolicyProduct.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!policy) return res.status(404).json({ message: 'Not found' });
  audit({ action: 'policy.update', actorId: req.user?.id, details: { policyId: policy._id } });
  res.json(policy);
};

export const deletePolicy = async (req, res) => {
  await PolicyProduct.findByIdAndDelete(req.params.id);
  audit({ action: 'policy.delete', actorId: req.user?.id, details: { policyId: req.params.id } });
  res.json({ message: 'deleted' });
};
