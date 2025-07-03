const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');


// Get all organizations
router.get('/', authMiddleware(['superAdmin', 'orgAdmin']), async (req, res) => {
    try {
        const Organization = global.mongoose.Organization;
        console.debug('Getting organizations for user role:', req.user.role);
        
        let organizations;
        if (req.user.role === 'superAdmin') {
            // Super admins can see all organizations
            organizations = await Organization.find({});
        } else {
            // Org admins can only see their own organization
            organizations = await Organization.find({ _id: req.user.organizationId });
        }
        
        console.debug(`Found ${organizations.length} organizations`);
        res.json(organizations);
    } catch (error) {
        console.error('Get organizations error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create organization
router.post('/', authMiddleware(['superAdmin']), async (req, res) => {
try {
    const Organization = global.mongoose.Organization;
    const { name, description } = req.body;
    const newOrganization = new Organization({
        name,
        description
    });
    await newOrganization.save();
    res.status(201).json(newOrganization);
} catch (error) {
    console.error('Create organization error:', error);
    res.status(500).json({ error: 'Internal server error' });
}
    try {
        const { name, description } = req.body;
        const newOrganization = new Organization({
            name,
            description
        });
        await newOrganization.save();
        res.status(201).json(newOrganization);
    } catch (error) {
        console.error('Create organization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Update organization
router.put('/:id', authMiddleware(['superAdmin']), async (req, res) => {
    try {
        const Organization = global.mongoose.Organization;
        const { id } = req.params;
        const { name, description } = req.body;

        const organization = await Organization.findById(id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        organization.name = name || organization.name;
        organization.description = description || organization.description;
        await organization.save();

        res.json(organization);
    } catch (error) {
        console.error('Update organization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Delete organization
router.delete('/:id', authMiddleware(['superAdmin']), async (req, res) => {
    try {
        const Organization = global.mongoose.Organization;
        const WebUIUser = global.mongoose.WebUIUser;
        const MatchEvent = global.mongoose.MatchEvent;
        const { id } = req.params;

        const organization = await Organization.findById(id);
        if (!organization) {
            return res.status(404).json({ error: 'Organization not found' });
        }

        // Delete associated WebUIUsers
        await WebUIUser.deleteMany({ organizationId: id });
        // Delete associated MatchEvents
        await MatchEvent.deleteMany({ organizationId: id });
        // Delete associated PassedMatchEvents (assuming they are linked to MatchEvents or Organization)
        // This might need more specific logic if PassedMatchEvent is not directly linked to organizationId
        // For now, assuming it's linked via MatchEvent, so deleting MatchEvent will cascade.

        await organization.deleteOne();

        res.json({ message: 'Organization and associated data deleted successfully' });
    } catch (error) {
        console.error('Delete organization error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;