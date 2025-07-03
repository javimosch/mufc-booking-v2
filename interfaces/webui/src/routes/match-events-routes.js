const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/auth-middleware');

// Create match event
router.post('/', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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
router.post('/:eventId/join', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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
router.post('/:eventId/unjoin', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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
router.post('/:eventId/cancel', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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
router.post('/:eventId/uncancel', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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



// Get match events
router.get('/', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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

// Get match events count
router.get('/count', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
        const count = await MatchEvent.countDocuments({ organizationId: req.user.organizationId });
        console.debug(`Found ${count} events for organizationId: ${req.user.organizationId}`);
        res.json({ count });
    } catch (error) {
        console.error('Get match events count error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Get single match event
router.get('/:eventId', async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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

// Delete match event
router.delete('/:eventId', authMiddleware(['orgAdmin', 'superAdmin']), async (req, res) => {
    try {
        const MatchEvent = global.mongoose.MatchEvent;
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


module.exports = router;
