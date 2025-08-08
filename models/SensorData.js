// models/SensorData.js
const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema({
    value1: Number,
    value2: Number,
    value3: Number,
    value4: Number,
    value5: Number,
    value6: Number,
    value7: Number,
    value8: Number,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SensorData', sensorSchema);