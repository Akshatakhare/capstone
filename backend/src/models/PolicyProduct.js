import mongoose from 'mongoose';

const policyProductSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: String,
  premium: { type: Number, required: true },
  termMonths: { type: Number, default: 12 },
  minSumInsured: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('PolicyProduct', policyProductSchema);
