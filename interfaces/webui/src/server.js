require('dotenv').config({
    path:__dirname + '/../../../.env'
});

const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { WebUIUser, MatchEvent, Organization } = require('../../../utils/schemas');
const GenericCLI = require('../../../src/cli.js');
const databaseManager = require('../../../utils/database');

databaseManager.connect();

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Custom WebAPI class extending the CLI
class WebAPIManager extends GenericCLI {
    constructor() {
        super();
        this.progressCallback = null;
    }

    setProgressCallback(callback) {
        this.progressCallback = callback;
    }

    // Override methods to provide web-specific behavior
    async runProcessWithProgress(config) {
        // Set up configuration
        this.config = { ...this.config, ...config };
        
        // Set speed settings
        const speedPresets = {
            'turbo': { sleepBetweenOps: 0, batchSize: 500, progressInterval: 100 },
            'fast': { sleepBetweenOps: 10, batchSize: 200, progressInterval: 75 },
            'normal': { sleepBetweenOps: 50, batchSize: 100, progressInterval: 50 },
            'gentle': { sleepBetweenOps: 100, batchSize: 50, progressInterval: 25 }
        };
        
        this.speedSettings = speedPresets[config.speed] || speedPresets.normal;

        const startTime = Date.now();
        const totalSteps = 100;

        // Log activity start
        // if (this.databaseConnected) { // No longer needed
        //     await this.processService.logActivity('WEB_PROCESS_STARTED', {
        //         setting: this.config.setting,
        //         speedPreset: config.speed
        //     });
        // }

        // Simulate processing with progress updates
        for (let i = 0; i <= totalSteps; i += this.speedSettings.batchSize) {
            const progress = Math.min(i, totalSteps);
            const percentage = Math.round((progress / totalSteps) * 100);
            
            // Send progress updates
            if (this.progressCallback && (progress % this.speedSettings.progressInterval === 0 || progress === totalSteps)) {
                this.progressCallback({
                    type: 'progress',
                    percentage,
                    message: `🔄 Processing: ${percentage}% (${progress}/${totalSteps})`
                });
            }
            
            if (this.speedSettings.sleepBetweenOps > 0) {
                await this.sleep(this.speedSettings.sleepBetweenOps);
            }
        }
        
        const endTime = Date.now();
        const duration = ((endTime - startTime) / 1000).toFixed(2);

        const result = {
            setting: this.config.setting,
            totalSteps,
            duration,
            speedSettings: config.speed,
            timestamp: Date.now(),
            success: true
        };

        // Save process result to database
        // if (this.databaseConnected) { // No longer needed
        //     await this.processService.saveProcessResult(result);
        //     await this.processService.logActivity('WEB_PROCESS_COMPLETED', result);
        // }

        return result;
    }
}

// API Routes

// Login endpoint
app.post('/api/login', async (req, res) => {
    try {
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
        res.json({ token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to verify token and role
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
        res.status(401).json({ error: 'Unauthorized' });
    }
};

// Create match event
app.post('/api/match-events', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { title, startDate, repeatEach } = req.body;
        const newEvent = new MatchEvent({
            title,
            startDate: new Date(startDate),
            repeatEach,
            organizationId: req.user.organizationId
        });
        await newEvent.save();
        res.status(201).json(newEvent);
    } catch (error) {
        console.error('Create match event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Join user to event
app.post('/api/match-events/:eventId/join', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        // Check if user is already subscribed
        if (event.subscriptions.some(sub => sub.userId.equals(userId))) {
            return res.status(400).json({ error: 'User is already subscribed to this event' });
        }

        event.subscriptions.push({ userId, metadata: {} });
        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Un-join user from event
app.post('/api/match-events/:eventId/unjoin', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { eventId } = req.params;
        const { userId } = req.body;

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        const initialLength = event.subscriptions.length;
        event.subscriptions = event.subscriptions.filter(sub => !sub.userId.equals(userId));

        if (event.subscriptions.length === initialLength) {
            return res.status(400).json({ error: 'User was not subscribed to this event' });
        }

        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Un-join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Cancel match event iteration
app.post('/api/match-events/:eventId/cancel', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { eventId } = req.params;
        const { date } = req.body;

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        if (!event.metadata) {
            event.metadata = {};
        }
        if (!event.metadata.cancelledDates) {
            event.metadata.cancelledDates = [];
        }

        // Add date to cancelledDates if not already present
        if (!event.metadata.cancelledDates.includes(date)) {
            event.metadata.cancelledDates.push(date);
            event.markModified('metadata'); // Mark metadata as modified
            await event.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Cancel event iteration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Uncancel match event iteration
app.post('/api/match-events/:eventId/uncancel', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { eventId } = req.params;
        const { date } = req.body;

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        if (event.metadata && event.metadata.cancelledDates) {
            // Remove date from cancelledDates
            event.metadata.cancelledDates = event.metadata.cancelledDates.filter(d => d !== date);
            event.markModified('metadata'); // Mark metadata as modified
            await event.save();
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Uncancel event iteration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public join event
app.post('/api/public/match-events/:eventId/join', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { email, nickname } = req.body;

        let user = await WebUIUser.findOne({ email });
        if (!user) {
            const event = await MatchEvent.findById(eventId);
            user = new WebUIUser({
                email,
                password: 'temporary_password', // Public users don't have a password, set a temporary one
                organizationId: event.organizationId,
                role: 'user'
            });
            await user.save();
        }

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        if (event.subscriptions.some(sub => sub.userId.equals(user._id))) {
            return res.status(400).json({ error: 'User is already subscribed to this event' });
        }

        event.subscriptions.push({ userId: user._id, metadata: { nickname } });
        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Public join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public un-join event
app.post('/api/public/match-events/:eventId/unjoin', async (req, res) => {
    try {
        const { eventId } = req.params;
        const { email } = req.body;

        const user = await WebUIUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        const initialLength = event.subscriptions.length;
        event.subscriptions = event.subscriptions.filter(sub => !sub.userId.equals(user._id));

        if (event.subscriptions.length === initialLength) {
            return res.status(400).json({ error: 'User was not subscribed to this event' });
        }

        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Public un-join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get public match events
app.get('/api/public/match-events', async (req, res) => {
    try {
        const { organizationId } = req.query;
        if (!organizationId) {
            return res.status(400).json({ error: 'organizationId is required' });
        }
        const events = await MatchEvent.find({ organizationId });
        res.json(events);
    } catch (error) {
        console.error('Get public match events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get match events
app.get('/api/match-events', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const events = await MatchEvent.find({ organizationId: req.user.organizationId });
        // For events without a startDate, use createdAt as a fallback
        const eventsWithStartDates = events.map(event => {
            if (!event.startDate) {
                event.startDate = event.createdAt; // Use createdAt as fallback
            }
            return event;
        });
        res.json(eventsWithStartDates);
    } catch (error) {
        console.error('Get match events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single match event
app.get('/api/match-events/:eventId', async (req, res) => {
    try {
        const event = await MatchEvent.findById(req.params.eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }
        res.json(event);
    } catch (error) {
        console.error('Get match event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Create WebUI user
app.post('/api/users', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
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

app.get('/api/users', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
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

// Update user role (promote to orgAdmin)
app.put('/api/users/:id/role', authMiddleware(['superAdmin']), async (req, res) => {
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

// Create organization
app.post('/api/organizations', authMiddleware(['superAdmin']), async (req, res) => {
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
app.put('/api/organizations/:id', authMiddleware(['superAdmin']), async (req, res) => {
    try {
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
app.delete('/api/organizations/:id', authMiddleware(['superAdmin']), async (req, res) => {
    try {
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

// Delete match event
app.delete('/api/match-events/:eventId', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        await event.deleteOne();

        res.json({ message: 'Match Event deleted successfully' });
    } catch (error) {
        console.error('Delete match event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get current configuration
app.get('/api/config', async (req, res) => {
    try {
        const manager = new WebAPIManager();
        await manager.loadConfig();
        res.json(manager.config);
    } catch (error) {
        console.error('Get config error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Save configuration
app.post('/api/config', async (req, res) => {
    try {
        const config = req.body;
        const manager = new WebAPIManager();
        await manager.loadConfig();
        
        // Update config with new values
        manager.config = { ...manager.config, ...config };
        const saved = await manager.saveConfig();
        
        if (saved) {
            res.json({ success: true, config: manager.config });
        } else {
            res.status(500).json({ error: 'Failed to save configuration' });
        }
    } catch (error) {
        console.error('Save config error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Run process endpoint
app.post('/api/process', async (req, res) => {
    try {
        const config = req.body;
        
        // Validate input
        if (!config.setting) {
            return res.status(400).json({ error: 'Setting is required' });
        }

        // Set up streaming response
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Transfer-Encoding': 'chunked'
        });

        const manager = new WebAPIManager();
        await manager.loadConfig();
        
        // Set up progress callback
        manager.setProgressCallback((data) => {
            res.write(JSON.stringify(data) + '\n');
        });

        try {
            // Send initial progress
            res.write(JSON.stringify({
                type: 'progress',
                percentage: 5,
                message: 'Initializing process...'
            }) + '\n');

            const result = await manager.runProcessWithProgress(config);
            
            // Send completion
            res.write(JSON.stringify({
                type: 'complete',
                result: result
            }) + '\n');
            
        } catch (error) {
            res.write(JSON.stringify({
                type: 'error',
                message: error.message
            }) + '\n');
        }

        res.end();

    } catch (error) {
        console.error('Process error:', error);
        if (!res.headersSent) {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
});

// Get stats endpoint
app.get('/api/stats', async (req, res) => {
    try {
        const manager = new WebAPIManager();
        await manager.loadConfig();
        
        const stats = await manager.configManager.getStats();
        
        const webStats = {
            setting: manager.config.setting || 'Not configured',
            speedPreset: manager.config.speedPreset || 'normal',
            lastUpdated: manager.config.lastUpdated || null,
            serverUptime: process.uptime(),
            timestamp: new Date().toISOString(),
            database: {
                connected: manager.databaseConnected,
                ...stats
            }
        };
        
        res.json(webStats);
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        const databaseManager = require('../../../utils/database');
        const dbHealth = await databaseManager.healthCheck();
        
        res.json({ 
            status: 'ok', 
            timestamp: new Date().toISOString(),
            database: dbHealth
        });
    } catch (error) {
        res.status(500).json({ 
            status: 'error', 
            timestamp: new Date().toISOString(),
            error: error.message
        });
    }
});

// Serve the iframe page
app.get('/iframe', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/iframe.html'));
});

// Serve the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Start server
const server = app.listen(PORT, () => {
    console.log(`🚀 CLI+WebUI Boilerplate Web UI running on http://localhost:${PORT}`);
    console.log(`📁 Open your browser and navigate to the URL above to get started!`);
});

// Handle port conflicts gracefully
server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} is already in use.`);
        console.error('💡 Another instance might be running.');
        console.error('💡 Try stopping other instances or use a different port.');
        process.exit(1);
    } else {
        console.error('❌ Server error:', error.message);
        process.exit(1);
    }
});

// Graceful shutdown handling
process.on('SIGINT', () => {
    console.log('\n👋 Shutting down web server gracefully...');
    server.close(() => {
        console.log('✅ Web server stopped.');
        process.exit(0);
    });
});

process.on('SIGTERM', () => {
    console.log('\n👋 Received SIGTERM, shutting down gracefully...');
    server.close(() => {
        console.log('✅ Web server stopped.');
        process.exit(0);
    });
});

module.exports = app;
