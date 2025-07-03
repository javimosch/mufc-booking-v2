require('dotenv').config({
    path:__dirname + '/../../../.env'
});

const express = require('express');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');
const databaseManager = require('../../../utils/database');
const publicRoutes = require('./routes/public-routes');
const matchEventsRoutes = require('./routes/match-events-routes');
const orgRoutes = require('./routes/org-routes');
const authRoutes = require('./routes/auth-routes');
const userRoutes = require('./routes/user-routes');
const { WebUIUser } = require('../../../utils/schemas');
databaseManager.connect();

console.debug('WebUIUser model imported successfully:', WebUIUser);

// Load environment variables
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));


// API Routes

app.use('/api/match-events', matchEventsRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/public', publicRoutes)
app.use('/api/organizations', orgRoutes);
app.use('/api/users', userRoutes);


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
    const templateName = req.query.templateName;
    console.debug('Iframe request with templateName:', templateName);
    
    if (templateName) {
        const templatePath = path.join(__dirname, `../public/iframe_templates/${templateName}.html`);
        // Check if the template exists
        if (fs.existsSync(templatePath)) {
            return res.sendFile(templatePath);
        }
        console.debug(`Template ${templateName} not found, falling back to default`);
    }
    
    // Default template
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
