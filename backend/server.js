const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/predict', async (req, res) => {
    try {
        const { age, study_fail_ratio, parent_edu, social_score, goout, failures } = req.body;
        
        // Basic validation
        if ([age, study_fail_ratio, parent_edu, social_score, goout, failures].some(x => x === undefined)) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // Call ML Service
        const mlResponse = await axios.post('http://localhost:8000/predict', req.body);
        const data = mlResponse.data;
        
        res.json(data);
    } catch (error) {
        console.error("Error communicating with ML service:", error.message);
        res.status(500).json({ error: "ML Service Error" });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend server running on http://localhost:${PORT}`);
});
