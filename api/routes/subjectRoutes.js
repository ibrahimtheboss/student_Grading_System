const express = require('express');
const Subject = require('../models/Subject');
const router = express.Router();

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.status(200).json(subjects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subjects', error: error.message });
  }
});

// Add a new subject
router.post('/', async (req, res) => {
  const { subjectName } = req.body;
  try {
    const subject = new Subject({ subjectName });
    await subject.save();
    res.status(201).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error adding subject', error: error.message });
  }
});

// Update an existing subject
router.put('/:subjectKey', async (req, res) => {
  const { subjectKey } = req.params;
  const { subjectName } = req.body;
  try {
    const subject = await Subject.findOne({ subjectKey });
    if (!subject) return res.status(404).json({ message: 'Subject not found' });

    subject.subjectName = subjectName || subject.subjectName;

    await subject.save();
    res.status(200).json(subject);
  } catch (error) {
    res.status(500).json({ message: 'Error updating subject', error: error.message });
  }
});

module.exports = router;
