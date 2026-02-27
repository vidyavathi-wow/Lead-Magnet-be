// Wow Realty Lead Magnet Backend Server
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { addLeadToSheet, updateLeadWithScore } = require('./services/sheetsService');
const { sendNotification } = require('./services/emailService');

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

        // Save to Google Sheets only (NO EMAIL SENT HERE)
        addLeadToSheet({ name, businessEmail }).catch(sheetError => {
            console.error('Failed to sync lead to Google Sheets:', sheetError);
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

app.post('/api/leads/score', async (req, res) => {
    try {
        const { name, businessEmail, totalScore, maturityLabel, scores, isAbandoned } = req.body;

        if (!businessEmail) {
            return res.status(400).json({ message: 'Business email is required to update score' });
        }

        console.log(`Received score update for ${businessEmail} (Abandoned: ${isAbandoned})`);
        console.log('Payload:', req.body);

        // 1. Update Google Sheet
        console.log('Starting Google Sheet update...');
        const sheetResult = await updateLeadWithScore({ name, businessEmail, totalScore, maturityLabel, scores, isAbandoned });
        console.log('Sheet update result:', sheetResult);

        // 2. Send email notification ONLY HERE (when score is generated)
        console.log('Starting Email notification...');
        const emailResult = await sendNotification({
            name,
            businessEmail,
            totalScore,
            maturityLabel,
            scores,
            isAbandoned,
            classification: req.body.classification
        });
        console.log('Email notification result:', emailResult.messageId || 'Sent');

        res.status(200).json({
            message: 'Score updated and email sent',
            sheetStatus: sheetResult.status,
            emailStatus: 'sent'
        });
    } catch (error) {
        console.error('CRITICAL ERROR in /api/leads/score:', error);
        res.status(500).json({
            message: 'Internal server error',
            error: error.message
        });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK' });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});