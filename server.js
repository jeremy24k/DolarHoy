const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get('/api/dolares', async (req, res) => {
    try {
        const response = await axios.get('https://ve.dolarapi.com/v1/dolares');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from API:', error.message);
        res.status(500).json({ error: 'Error fetching data from API' });
    }
});

app.get('/api/estado', async (req, res) => {
    try {
        const response = await axios.get('https://ve.dolarapi.com/v1/estado');
        res.json(response.data);
    } catch (error) {
        console.error('Error fetching from API:', error.message);
        res.status(500).json({ error: 'Error fetching data from API' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
