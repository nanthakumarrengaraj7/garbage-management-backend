const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  ward: { type: mongoose.Schema.Types.ObjectId, ref: 'Ward', required: true },
  employeeNumber: { type: String, required: true }
});

const Employee = mongoose.model('Employee', employeeSchema);
module.exports = Employee;
