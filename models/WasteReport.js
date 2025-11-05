const mongoose = require('mongoose');

const wasteReportSchema = new mongoose.Schema({
  ward: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ward',
    required: true
  },
  reportDate: {
    type: Date,
    required: true
  },
  bioDegradable: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  nonBioDegradable: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  awareness: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Validate that bioDegradable + nonBioDegradable <= 100
wasteReportSchema.pre('validate', function(next) {
  if (this.bioDegradable + this.nonBioDegradable > 100) {
    this.invalidate('bioDegradable', 'Total percentage cannot exceed 100%');
    this.invalidate('nonBioDegradable', 'Total percentage cannot exceed 100%');
  }
  next();
});

module.exports = mongoose.model('WasteReport', wasteReportSchema);