import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  userPolicyId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserPolicy' },
  amount: { type: Number, required: true },
  method: { type: String, enum: ['CARD', 'NETBANKING', 'OFFLINE', 'SIMULATED'], default: 'SIMULATED' },
  reference: String
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
