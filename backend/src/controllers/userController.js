import User from '../models/User.js';

export const listUsers = async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash').lean();
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};



