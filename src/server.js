const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Lead = require('./models/Lead');
const { sendLeadNotification } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.post('/api/leads', async (req, res) => {
    try {
        const { name, businessEmail } = req.body;

        if (!name || !businessEmail) {
            return res.status(400).json({ message: 'Name and business email are required' });
        }

        // 1. Save to Database
        const newLead = new Lead({ name, businessEmail });
        await newLead.save();

        // 2. Send Email Notification
        try {
            await sendLeadNotification(newLead);
        } catch (emailError) {
            console.error('Failed to send email:', emailError);
            // We still return success for lead capture even if email fails
            // but we might want to log this specifically
        }

        res.status(201).json({ 
            message: 'Lead captured successfully', 
            lead: newLead 
        });

    } catch (error) {
        console.error('Error capturing lead:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
