const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Public join event iteration
router.post('/match-events/:eventId/join', async (req, res) => {
    try {
        const WebUIUser = global.mongoose.WebUIUser;
        const { eventId } = req.params;
        const { email, nickname, iterationDate } = req.body;

        if (!iterationDate) {
            return res.status(400).json({ error: 'Iteration date is required' });
        }

        let user = await WebUIUser.findOne({ email });
        if (!user) {
            const event = await global.mongoose.MatchEvent.findById(eventId);
            user = new WebUIUser({
                email,
                password: 'temporary_password', // Public users don't have a password, set a temporary one
                organizationId: event.organizationId,
                role: 'user'
            });
            await user.save();
        }

        const event = await global.mongoose.MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        // Check if user is already subscribed to this specific iteration
        if (event.subscriptions.some(sub => sub.userId.equals(user._id) && sub.iterationDate === iterationDate)) {
            return res.status(400).json({ error: 'User is already subscribed to this event iteration' });
        }

        event.subscriptions.push({ userId: user._id, iterationDate, metadata: { nickname } });
        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Public join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Public un-join event iteration
router.post('/match-events/:eventId/unjoin', async (req, res) => {
    try {
        const WebUIUser = global.mongoose.WebUIUser;
        const { eventId } = req.params;
        const { email, iterationDate } = req.body;

        if (!iterationDate) {
            return res.status(400).json({ error: 'Iteration date is required' });
        }

        const user = await WebUIUser.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        const event = await global.mongoose.MatchEvent.findById(eventId);
        if (!event) {
            return res.status(404).json({ error: 'Match Event not found' });
        }

        const initialLength = event.subscriptions.length;
        event.subscriptions = event.subscriptions.filter(sub => 
            !(sub.userId.equals(user._id) && sub.iterationDate === iterationDate)
        );

        if (event.subscriptions.length === initialLength) {
            return res.status(400).json({ error: 'User was not subscribed to this event iteration' });
        }

        await event.save();

        res.json({ success: true });
    } catch (error) {
        console.error('Public un-join event error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get public match events
router.get('/match-events', async (req, res) => {
    try {
        const WebUIUser = global.mongoose.WebUIUser;
        const { organizationId } = req.query;
        
        // Enhanced validation and debugging
        console.debug('Public match events request with organizationId:', organizationId);
        
        // Handle missing or invalid organizationId
        if (!organizationId || organizationId === 'undefined' || organizationId === 'null') {
            console.debug('Invalid organizationId provided:', organizationId);
            return res.status(200).json([]); // Return empty array instead of error
        }
        
        // Validate if organizationId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(organizationId)) {
            console.debug('Invalid ObjectId format for organizationId:', organizationId);
            return res.status(200).json([]); // Return empty array for invalid ObjectId
        }
        
        const events = await global.mongoose.MatchEvent.find({ organizationId });
        console.debug(`Found ${events.length} events for organizationId:`, organizationId);
        res.json(events);
    } catch (error) {
        console.error('Get public match events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


// Get public match events
router.get('/match-events', async (req, res) => {
    try {
        const WebUIUser = global.mongoose.WebUIUser;
        const { organizationId } = req.query;
        
        // Enhanced validation and debugging
        console.debug('Public match events request with organizationId:', organizationId);
        
        // Handle missing or invalid organizationId
        if (!organizationId || organizationId === 'undefined' || organizationId === 'null') {
            console.debug('Invalid organizationId provided:', organizationId);
            return res.status(200).json([]); // Return empty array instead of error
        }
        
        // Validate if organizationId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(organizationId)) {
            console.debug('Invalid ObjectId format for organizationId:', organizationId);
            return res.status(200).json([]); // Return empty array for invalid ObjectId
        }
        
        const events = await global.mongoose.MatchEvent.find({ organizationId });
        console.debug(`Found ${events.length} events for organizationId:`, organizationId);
        res.json(events);
    } catch (error) {
        console.error('Get public match events error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single public match event by ID
router.get('/match-events/:eventId', async (req, res) => {
    try {
        const { eventId } = req.params;
        console.debug('Getting public match event by ID:', eventId);
        
        // Validate if eventId is a valid ObjectId
        if (!mongoose.Types.ObjectId.isValid(eventId)) {
            console.debug('Invalid ObjectId format for eventId:', eventId);
            return res.status(404).json({ error: 'Match Event not found' });
        }
        
        const event = await global.mongoose.MatchEvent.findById(eventId);
        if (!event) {
            console.debug('No event found with ID:', eventId);
            return res.status(404).json({ error: 'Match Event not found' });
        }
        
        console.debug('Found event:', event.title);
        res.json(event);
    } catch (error) {
        console.error('Get public match event by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;