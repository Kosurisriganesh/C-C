const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token'); // ✅ this must match frontend

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecrettoken');
    req.user = decoded.user;

    if (!req.user || !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admin privileges required' });
    }

    next();
  } catch (err) {
    console.error('Invalid token:', err.message);
    res.status(401).json({ message: 'Token is not valid' });
  }
};
