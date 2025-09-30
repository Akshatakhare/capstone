import mongoose from 'mongoose';

const auditSchema = new mongoose.Schema({
  action: { type: String, required: true },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  details: { type: Object },
  ip: String,
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('AuditLog', auditSchema);
