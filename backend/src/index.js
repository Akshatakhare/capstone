import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import morgan from 'morgan';

import authRoutes from './routes/auth.js';
import policyRoutes from './routes/policies.js';
import userPoliciesRoutes from './routes/userPolicies.js';
import claimRoutes from './routes/claims.js';
import paymentRoutes from './routes/payments.js';
import agentRoutes from './routes/agents.js';
import adminRoutes from './routes/admin.js';
import userRoutes from './routes/users.js';

dotenv.config();

const app = express();
app.use(cors({
  origin: ['http://localhost:4200', 'http://127.0.0.1:4200'],
  credentials: true
}));
app.use(express.json());
app.use(morgan('dev'));

// API routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/policies', policyRoutes);
app.use('/api/v1/user/policies', userPoliciesRoutes);
app.use('/api/v1/claims', claimRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/agents', agentRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/users', userRoutes);

// health
app.get('/', (req, res) => res.json({ message: 'Insurance API running' }));

// connect db and start
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI not set in .env');
  process.exit(1);
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}/`));
  })
  .catch(err => {
    console.error('DB connection error', err);
    process.exit(1);
  });
