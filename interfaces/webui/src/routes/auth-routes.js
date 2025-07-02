const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/login', async (req, res) => {
    try {
        const WebUIUser = global.mongoose.WebUIUser;
        const { email, password } = req.body;
        const user = await WebUIUser.findOne({ email });

        if (!user) {
            console.log('User not found');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            console.log('Password does not match');
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ userId: user._id, organizationId: user.organizationId, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        console.debug('Login successful:', { userId: user._id, organizationId: user.organizationId, role: user.role });
        res.json({ 
            token,
            organizationId: user.organizationId,
            role: user.role 
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
