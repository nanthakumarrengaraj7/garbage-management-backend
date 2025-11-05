const express = require('express');
const router = express.Router();
const WasteReport = require('../models/WasteReport');
const Ward = require('../models/ward');

// Get all waste reports with ward details
router.get('/', async (req, res) => {
  try {
    const reports = await WasteReport.find()
      .populate('ward', 'name wardNumber')
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a new waste report
router.post('/', async (req, res) => {
  const { ward, reportDate, bioDegradable, nonBioDegradable, awareness } = req.body;
  
  // Validate ward exists
  const wardExists = await Ward.findById(ward);
  if (!wardExists) {
    return res.status(400).json({ message: 'Invalid ward ID' });
  }

  const report = new WasteReport({
    ward,
    reportDate,
    bioDegradable,
    nonBioDegradable,
    awareness
  });

  try {
    const newReport = await report.save();
    res.status(201).json(newReport);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;