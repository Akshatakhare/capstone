import AuditLog from '../models/AuditLog.js';

export const audit = async ({ action, actorId, details = {}, ip = '' }) => {
  try {
    await AuditLog.create({ action, actorId, details, ip });
  } catch (err) {
    console.error('Audit error:', err);
  }
};
