const express = require('express');
const router = express.Router();
const User = require('../models/User');

// ✅ Get all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/:id', async (req, res) => {

    const _id = req.params.id;
    try {
      const users = await User.find({_id});
      res.json(users);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

// ✅ Update user by ID
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { fullName, email, phone, address, role } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { fullName, email, phone, address, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// ✅ Delete user by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
