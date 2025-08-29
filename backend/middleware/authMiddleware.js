import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success:false, error:{ code:'AUTH_401', message:'No token' }});
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ success:false, error:{ code:'AUTH_401', message:'User not found' }});
    req.user = user;
    next();
  } catch (e) {
    return res.status(401).json({ success:false, error:{ code:'AUTH_401', message:'Invalid token' }});
  }
};
