const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating keys

const SubjectSchema = new mongoose.Schema({
  subjectKey: { type: String, default: uuidv4, unique: true }, // Automatically generate unique UUID
  subjectName: { type: String, required: true },
});

module.exports = mongoose.model('Subject', SubjectSchema);
