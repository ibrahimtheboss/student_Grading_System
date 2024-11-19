// api/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
console.log('MongoDB URI:', process.env.MONGO_URI);

mongoose.connect('mongodb+srv://test:test@cluster0.2hzbiju.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error(err));

// API Routes
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/subjects', require('./routes/subjectRoutes'));

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../client/build')));

// The catchall handler: for any request that doesn't match one above, send back React's index.html file.
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname + '/../client/build/index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});