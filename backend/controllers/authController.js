import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User.js';
import { sendEmail } from '../utils/sendEmail.js';

const signToken = (id) => {
  const exp = process.env.JWT_EXPIRE || '30d';
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: exp });
};

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success:false, error:{ code:'AUTH_003', message:'Email & password required' }});
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ success:false, error:{ code:'AUTH_001', message:'Email already registered' }});
    const user = await User.create({ email, password });
    const token = signToken(user._id);
    return res.status(201).json({ success:true, data:{ id: user._id, email: user.email, token } });
  } catch (e) {
    return res.status(500).json({ success:false, error:{ code:'AUTH_500', message:e.message }});
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success:false, error:{ code:'AUTH_002', message:'Invalid credentials' }});
    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ success:false, error:{ code:'AUTH_002', message:'Invalid credentials' }});
    user.lastLogin = new Date();
    await user.save();
    const token = signToken(user._id);
    return res.json({ success:true, data:{ message:'Login successful', token, id: user._id, email: user.email } });
  } catch (e) {
    return res.status(500).json({ success:false, error:{ code:'AUTH_500', message:e.message }});
  }
};

export const me = async (req, res) => {
  return res.json({ success:true, data: req.user });
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      // Do not reveal existence
      return res.json({ success:true, data:{ message:'If the email exists, a reset link was sent' } });
    }
    const rawToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    const resetURLBase = process.env.APP_URL || 'http://localhost:5500/frontend';
    const link = `${resetURLBase}/reset.html?token=${rawToken}`;

    await sendEmail({
      to: email,
      subject: 'Reset your password',
      html: `<p>You requested a password reset.</p>
             <p>Click the link below to set a new password (valid for 30 minutes):</p>
             <p><a href="${link}">${link}</a></p>`
    });

    return res.json({ success:true, data:{ message:'If the email exists, a reset link was sent' } });
  } catch (e) {
    return res.status(500).json({ success:false, error:{ code:'AUTH_500', message:e.message }});
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) return res.status(400).json({ success:false, error:{ code:'AUTH_003', message:'Token & new password required' }});
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpires: { $gt: new Date() }
    });
    if (!user) return res.status(400).json({ success:false, error:{ code:'AUTH_004', message:'Token invalid or expired' }});

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    return res.json({ success:true, data:{ message:'Password updated' } });
  } catch (e) {
    return res.status(500).json({ success:false, error:{ code:'AUTH_500', message:e.message }});
  }
};
