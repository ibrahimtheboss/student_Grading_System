const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // Import UUID for generating keys

const StudentSchema = new mongoose.Schema({
  studentKey: { type: String, default: uuidv4, unique: true }, // Automatically generate unique UUID
  studentName: { type: String, required: true },
  subjectKey: { type: String, required: true },
  grade: { type: String, required: true }, // Grade as string
  remarks: { type: String, required: true }, // Frontend provides remarks
});

module.exports = mongoose.model('Student', StudentSchema);
