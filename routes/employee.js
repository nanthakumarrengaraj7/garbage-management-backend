const express = require('express');
const router = express.Router();
const Employee = require('../models/employee');

// ➡️ Get all employees with populated ward details
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.find().populate('ward');
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ➡️ Add employee
router.post('/', async (req, res) => {
  const { name, email, phone, ward, employeeNumber } = req.body;
  try {
    const newEmployee = new Employee({ name, email, phone, ward, employeeNumber });
    await newEmployee.save();
    res.status(201).json(newEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ➡️ Update employee
router.put('/:id', async (req, res) => {
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEmployee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ➡️ Delete employee
router.delete('/:id', async (req, res) => {
  try {
    await Employee.findByIdAndDelete(req.params.id);
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
