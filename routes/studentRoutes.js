const express = require('express');
const Student = require('../models/Student');
const router = express.Router();

// Get all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching students', error: error.message });
  }
});

// Add a new student
router.post('/', async (req, res) => {
  const { studentName, subjectKey, grade, remarks } = req.body;
  try {
    const student = new Student({ studentName, subjectKey, grade, remarks });
    await student.save();
    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error: error.message });
  }
});

// Update an existing student
router.put('/:studentKey', async (req, res) => {
  const { studentKey } = req.params;
  const { studentName, subjectKey, grade, remarks } = req.body;
  try {
    const student = await Student.findOne({ studentKey });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    student.studentName = studentName || student.studentName;
    student.subjectKey = subjectKey || student.subjectKey;
    student.grade = grade || student.grade;
    student.remarks = remarks || student.remarks;

    await student.save();
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json({ message: 'Error updating student', error: error.message });
  }
});

// Delete a student by studentKey
router.delete('/:studentKey', async (req, res) => {
  const { studentKey } = req.params;
  try {
    const student = await Student.findOneAndDelete({ studentKey });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    res.status(200).json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting student', error: error.message });
  }
});

module.exports = router;
