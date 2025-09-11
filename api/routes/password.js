import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Request password reset code
router.post('/request-reset', async (req, res) => {
  const { email } = req.body;
  console.log('Password reset requested for:', email);
  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No account found for email:', email);
      return res.status(404).json({ message: 'No account found with that email.' });
    }
    // Generate a 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetCode = code;
    user.resetCodeExpires = Date.now() + 15 * 60 * 1000; // 15 min expiry
    await user.save();
    console.log('Reset code generated for', email, 'code:', code);
    // In real app, send code via email. For demo, return code in response.
    res.json({ message: 'Reset code generated.', code });
  } catch (err) {
    console.error('Error in password reset request:', err);
    res.status(500).json({ message: err.message });
  }
});

// Reset password using code
router.post('/reset', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || user.resetCode !== code || Date.now() > user.resetCodeExpires) {
      return res.status(400).json({ message: 'Invalid or expired reset code.' });
    }
    user.password = await bcrypt.hash(newPassword, 10);
    user.resetCode = undefined;
    user.resetCodeExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
