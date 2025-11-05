const mongoose = require('mongoose');

const wardSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  wardNumber: {
    type: String,
    required: true
  },
  taluk: {
    type: String,
    required: true
  },
  district: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  }
});

const Ward = mongoose.model('Ward', wardSchema);

module.exports = Ward;
