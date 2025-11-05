const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Ward = require('../models/ward');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// ➡️ GET all wards
router.get('/', async (req, res) => {
  try {
    const wards = await Ward.find();
    res.status(200).json(wards);
  } catch (error) {
    res.status(500).json({ message: 'Failed to load wards', error });
  }
});

// ➡️ POST create new ward
router.post('/', upload.single('image'), async (req, res) => {
  const { wardNumber, taluk, district, state, country } = req.body;
  const imageUrl = req.file ? `/uploads/${req.file.filename}` : '';

  if (!wardNumber || !taluk || !district || !state || !country || !imageUrl) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
    const newWard = new Ward({
      imageUrl,
      wardNumber,
      taluk,
      district,
      state,
      country
    });

    await newWard.save();
    res.status(201).json(newWard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ward', error });
  }
});

// ➡️ PUT update existing ward
router.put('/update/:id', upload.single('image'), async (req, res) => {
  const { wardNumber, taluk, district, state, country } = req.body;
  let imageUrl = req.file ? `/uploads/${req.file.filename}` : undefined;

  try {
    const existingWard = await Ward.findById(req.params.id);

    if (!existingWard) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    // Update fields
    existingWard.wardNumber = wardNumber || existingWard.wardNumber;
    existingWard.taluk = taluk || existingWard.taluk;
    existingWard.district = district || existingWard.district;
    existingWard.state = state || existingWard.state;
    existingWard.country = country || existingWard.country;
    
    if (imageUrl) {
      // Delete old image file if a new one is uploaded
      if (existingWard.imageUrl) {
        const oldImagePath = path.join(__dirname, `../${existingWard.imageUrl}`);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      existingWard.imageUrl = imageUrl;
    }

    await existingWard.save();
    res.status(200).json(existingWard);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update ward', error });
  }
});

// ➡️ DELETE delete ward
router.delete('/delete/:id', async (req, res) => {
  try {
    const ward = await Ward.findById(req.params.id);

    if (!ward) {
      return res.status(404).json({ message: 'Ward not found' });
    }

    // Delete image file
    if (ward.imageUrl) {
      const imagePath = path.join(__dirname, `../${ward.imageUrl}`);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Ward.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Ward deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete ward', error });
  }
});

module.exports = router;
