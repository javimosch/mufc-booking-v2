const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authMiddleware = (allowedRoles) => (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        if (allowedRoles && !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        next();
    } catch (error) {
        console.error('Auth middleware error:', {
            token,
            allowedRoles,
            error
        });
        res.status(401).json({ error: 'Unauthorized' });
    }
};


module.exports = authMiddleware;
