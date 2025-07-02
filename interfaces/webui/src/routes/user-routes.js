const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');    


// Create WebUI user
router.post('/', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    const WebUIUser = global.mongoose.WebUIUser;
    try {
        const { email, password, role } = req.body;
        const newWebUIUser = new WebUIUser({
            email,
            password,
            role,
            organizationId: req.user.organizationId
        });
        await newWebUIUser.save();
        res.status(201).json(newWebUIUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(400).json({ error: 'Error creating user' });
    }
});

router.get('/', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    const WebUIUser = global.mongoose.WebUIUser;
    try {
        let users;
        if (req.user.role === 'superAdmin') {
            // Super admins can see all users from all organizations
            users = await WebUIUser.find({}).select('-password');
        } else {
            // Org admins can only see users in their own organization
            users = await WebUIUser.find({ organizationId: req.user.organizationId }).select('-password');
        }
        res.json(users);
    } catch (error) {
        console.error('Get WebUI users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get users count
router.get('/count', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    const WebUIUser = global.mongoose.WebUIUser;
    try {
        let count;
        if (req.user.role === 'superAdmin') {
            // Super admins can see count of all users
            count = await WebUIUser.countDocuments({});
        } else {
            // Org admins can only see count of users in their own organization
            count = await WebUIUser.countDocuments({ organizationId: req.user.organizationId });
        }
        console.debug(`Found ${count} users for ${req.user.role}`);
        res.json({ count });
    } catch (error) {
        console.error('Get users count error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update user role (promote to orgAdmin)
router.put('/:id/role', authMiddleware(['superAdmin']), async (req, res) => {
    const WebUIUser = global.mongoose.WebUIUser;
    try {
        const { role, organizationId } = req.body;
        const userToUpdate = await WebUIUser.findById(req.params.id);

        if (!userToUpdate) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Only allow promotion to orgAdmin for now
        if (role !== 'orgAdmin') {
            return res.status(400).json({ error: 'Invalid role specified.' });
        }

        userToUpdate.role = role;
        if (organizationId) {
            userToUpdate.organizationId = organizationId;
        }
        
        await userToUpdate.save();

        res.json(userToUpdate);
    } catch (error) {
        console.error('Update user role error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;