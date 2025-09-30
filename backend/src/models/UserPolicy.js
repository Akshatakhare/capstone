import mongoose from 'mongoose';

const userPolicySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  policyProductId: { type: mongoose.Schema.Types.ObjectId, ref: 'PolicyProduct', required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  premiumPaid: { type: Number, required: true },
  status: { type: String, enum: ['ACTIVE', 'CANCELLED', 'EXPIRED'], default: 'ACTIVE' },
  assignedAgentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  nominee: {
    name: String,
    relation: String
  }
}, { timestamps: true });

export default mongoose.model('UserPolicy', userPolicySchema);
