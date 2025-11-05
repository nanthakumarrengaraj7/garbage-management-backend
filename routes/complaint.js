const express = require('express');
const router = express.Router();
const Complaint = require('../models/complaint');
const Employee = require('../models/employee');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Uploads directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    // Allow only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
}).array('images', 5); // Allow up to 5 images

// ✅ Create a new complaint
router.post('/', (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            return res.status(400).json({ message: err.message });
        }

        try {
            const { title, description, wardNumber, raisedBy , location } = req.body;
            console.log(title, description, wardNumber, raisedBy, location);

            if (!title || !description || !wardNumber || !raisedBy) {
                return res.status(400).json({ message: 'All fields are required' });
            }

            // Handle image URLs
            const images = req.files.map(file => `/uploads/${file.filename}`);

            const complaint = new Complaint({
                title,
                location,
                description,
                wardNumber,
                raisedBy,
                images
            });

            await complaint.save();
            res.status(201).json({ message: 'Complaint created successfully', complaint });
        } catch (error) {
            console.log(error)
            res.status(500).json({ message: 'Failed to create complaint', error: error.message });
        }
    });
});

// ✅ Get all complaints with filter options
router.get('/', async (req, res) => {
    try {
        const { status, assignedTo, fromDate, toDate, wardNumber } = req.query;

        const filter = {};

        if (status) filter.status = status;
        if (assignedTo) filter.assignedTo = assignedTo;
        if (wardNumber) filter.wardNumber = wardNumber;
        if (fromDate && toDate) {
            filter.createdAt = {
                $gte: new Date(fromDate),
                $lte: new Date(toDate)
            };
        }

        const complaints = await Complaint.find(filter);
        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get complaints', error: error.message });
    }
});

// ✅ Update complaint status or assign employee
router.put('/:id', async (req, res) => {
    try {
        const { status, assignedTo } = req.body;
        const { id } = req.params;

        console.log(status , assignedTo);
        

        // Find the complaint by ID
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        // If status is provided, update it
        if (status) complaint.status = status;

        // If assignedTo is provided, find the employee and update the complaint
        if (assignedTo) {
            const employee = await Employee.findById(assignedTo);
            if (!employee) {
                return res.status(404).json({ message: 'Employee not found' });
            }
            // Store the employee's name in the complaint
            complaint.assignedTo = employee.name;
        }

        // Save the updated complaint
        await complaint.save();
        res.status(200).json({ message: 'Complaint updated successfully', complaint });
    } catch (error) {
        res.status(500).json({ message: 'Failed to update complaint', error: error.message });
    }
});


// ✅ Delete complaint
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const complaint = await Complaint.findByIdAndDelete(id);
        if (!complaint) {
            return res.status(404).json({ message: 'Complaint not found' });
        }

        res.status(200).json({ message: 'Complaint deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete complaint', error: error.message });
    }
});


router.get('/user/:raisedBy', async (req, res) => {
    try {
        const { raisedBy } = req.params;

        if (!raisedBy) {
            return res.status(400).json({ message: 'Raised by field is required' });
        }

        const complaints = await Complaint.find({ raisedBy });

        console.log(complaints)

        res.status(200).json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Failed to get complaints', error: error.message });
    }
});


module.exports = router;
