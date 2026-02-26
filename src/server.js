// Wow Realty Lead Magnet Backend Server
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { addLeadToSheet } = require('./services/sheetsService');
const { sendLeadNotification } = require('./services/emailService');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.post('/api/leads', async (req, res) => {
    try {
        const { name, businessEmail } = req.body;

        if (!name || !businessEmail) {
            return res.status(400).json({ message: 'Name and business email are required' });
        }

        // 1. Save to Google Sheets in background
        addLeadToSheet({ name, businessEmail }).catch(sheetError => {
            console.error('Failed to sync lead to Google Sheets:', sheetError);
        });

        // 3. Send email notification in the background (fire-and-forget)
        sendLeadNotification({ name, businessEmail }).catch(emailError => {
            console.error('Failed to send email notification:', emailError);
        });

        res.status(201).json({
            message: 'Lead captured successfully',
            lead: { name, businessEmail, createdAt: new Date() }
        });

    } catch (error) {
        console.error('Error capturing lead:', error);
        if (!res.headersSent) {
            res.status(500).json({ message: 'Internal server error' });
        }
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
