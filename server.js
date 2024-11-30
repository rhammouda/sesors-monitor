const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON
app.use(bodyParser.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

// Store data in memory (use a database for production!)
let sensorData = { temperature: null, humidity: null, lastUpdate: null };
let desiredConfig = { desiredTemperature: null, desiredHumidity: null };

// POST endpoint to receive sensor data
app.post('/data', (req, res) => {
    const { temperature, humidity } = req.body;

    if (temperature === undefined || humidity === undefined) {
        return res.status(400).send('Temperature and Humidity are required.');
    }

    sensorData.temperature = temperature;
    sensorData.humidity = humidity;
    sensorData.lastUpdate = new Date().toLocaleString(); // Record timestamp

    console.log(`Received data - Temperature: ${temperature}, Humidity: ${humidity}, Time: ${sensorData.lastUpdate}`);
    res.json(desiredConfig);;
});

// API endpoint to fetch sensor data
app.get('/api/data', (req, res) => {
    res.json(sensorData);
});

// API endpoint to fetch desired configuration
app.get('/api/config', (req, res) => {
    res.json(desiredConfig);
});

// API endpoint to set desired configuration
app.post('/api/config', (req, res) => {
    const { desiredTemperature, desiredHumidity } = req.body;

    if (desiredTemperature !== undefined) {
        desiredConfig.desiredTemperature = parseFloat(desiredTemperature);
    }

    if (desiredHumidity !== undefined) {
        desiredConfig.desiredHumidity = parseFloat(desiredHumidity);
    }

    console.log(`Updated desired config - Temperature: ${desiredConfig.desiredTemperature}, Humidity: ${desiredConfig.desiredHumidity}`);
    res.status(200).send('Configuration updated successfully.');
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
