const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Get MongoDB connection string from environment variable
const uri = process.env.MONGO_URL;

if (!uri) {
    console.error('Error: MONGO_URL environment variable not set');
    process.exit(1);
}

// Connect to MongoDB
mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    });

// Define schema for the 8 float points
const dataSchema = new mongoose.Schema({
    point1: Number,
    point2: Number,
    point3: Number,
    point4: Number,
    point5: Number,
    point6: Number,
    point7: Number,
    point8: Number,
    createdAt: { type: Date, default: Date.now },
});

const DataModel = mongoose.model('Data', dataSchema);

// POST route to save data
app.post('/api/data', async (req, res) => {
    try {
        const data = new DataModel(req.body);
        const savedData = await data.save();
        res.status(201).json(savedData);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET route to fetch last inserted data
app.get('/api/data/last', async (req, res) => {
    try {
        const lastData = await DataModel.findOne().sort({ createdAt: -1 });
        if (!lastData) {
            return res.status(404).json({ message: 'No data found' });
        }
        res.json(lastData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Use environment port or default to 3000
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('Server running on port ${PORT}');
});