// routes/contact.js
const express = require('express');
const router = express.Router();
const Contact = require('../models/contactus');

// Handle POST request to /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newContact = new Contact({ name, email, message });
    await newContact.save();
    res.status(201).json({ message: 'Query submitted successfully!' });
  } catch (error) {
    console.error('Error saving query:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/', async (req, res) => {
    try {
      const queries = await Contact.find();
      res.status(200).json(queries);
    } catch (error) {
      res.status(500).json({ message: 'Failed to fetch queries', error: error.message });
    }
  });

  router.delete('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await Contact.findByIdAndDelete(id);
      res.status(200).json({ message: 'Query deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to delete query', error: error.message });
    }
  });

module.exports = router;