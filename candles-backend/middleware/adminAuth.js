// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // Get token from header (using 'x-auth-token' as per your frontend/backend consistency)
    const token = req.header('x-auth-token');

    // Check if no token
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // Verify token
    try {
        // Use process.env.JWT_SECRET from your .env file
        // Provide a fallback 'mysecrettoken' for local dev if .env isn't loaded or missing.
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysecrettoken');

        // Attach the decoded user payload to the request
        // Ensure that when you sign your JWT, the 'user' object contains 'id' and 'isAdmin'
        req.user = decoded.user;

        // Check for admin role directly from the decoded user payload
        if (!req.user || !req.user.isAdmin) {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }

        next(); // Proceed to the next middleware/route handler
    } catch (err) {
        console.error('Invalid token:', err.message);
        res.status(401).json({ message: 'Token is not valid' });
    }
};