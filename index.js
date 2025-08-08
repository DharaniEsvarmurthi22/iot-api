// index.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const SensorData = require('./models/SensorData');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGO_URI;
console.log('MongoDB:', uri);
const port = process.env.PORT || 5000;

mongoose.connect(uri)
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err.message || err);
        process.exit(1);
    });

// POST /api/data  -> insert one document with 8 floats
app.post('/api/data', async (req, res) => {
    try {
        // Expect body with keys value1..value8 (numbers)
        const { value1, value2, value3, value4, value5, value6, value7, value8 } = req.body;

        // Basic validation
        const values = [value1, value2, value3, value4, value5, value6, value7, value8];
        if (values.some(v => typeof v !== 'number')) {
            return res.status(400).json({ error: 'All value1..value8 must be numbers' });
        }

        const doc = new SensorData({ value1, value2, value3, value4, value5, value6, value7, value8 });
        const saved = await doc.save();
        res.status(201).json({ message: 'Data saved', id: saved._id });
    } catch (err) {
        console.error('Insert error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET /api/latest -> return latest document
app.get('/api/latest', async (req, res) => {
    try {
        const latest = await SensorData.findOne().sort({ createdAt: -1 }).lean();
        res.json(latest || {});
    } catch (err) {
        console.error('Fetch error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => console.log('Server running at http://localhost:${port})'));