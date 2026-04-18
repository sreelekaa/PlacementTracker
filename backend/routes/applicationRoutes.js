const express = require('express');
const router = express.Router();
const Application = require('../models/Application');
const { protect } = require('../middleware/auth');

// Apply protection to all routes below
router.use(protect);

// @route GET /api/applications
router.get('/', async (req, res) => {
    try {
        const applications = await Application.find({ user: req.user.id }).sort('-createdAt');
        res.json(applications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/applications/stats
router.get('/stats', async (req, res) => {
    try {
        const stats = await Application.aggregate([
            { $match: { user: req.user._id } },
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        
        // Transform array into an object mapping status to count
        const defaultStats = {
            Applied: 0,
            Interviewing: 0,
            Offered: 0,
            Rejected: 0
        };
        
        stats.forEach(stat => {
            defaultStats[stat._id] = stat.count;
        });
        
        res.json(defaultStats);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/applications
router.post('/', async (req, res) => {
    try {
        const { company, role, status, link, notes, reminderDate } = req.body;
        
        const application = new Application({
            user: req.user.id,
            company,
            role,
            status,
            link,
            notes,
            reminderDate
        });
        
        const createdApplication = await application.save();
        res.status(201).json(createdApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/applications/:id
router.put('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        if (application.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        const updatedApplication = await Application.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        
        res.json(updatedApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/applications/:id
router.delete('/:id', async (req, res) => {
    try {
        const application = await Application.findById(req.params.id);
        
        if (!application) return res.status(404).json({ message: 'Application not found' });
        
        if (application.user.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
        
        await application.deleteOne();
        res.json({ message: 'Application removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
