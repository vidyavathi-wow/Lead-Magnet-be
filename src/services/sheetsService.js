const { google } = require('googleapis');
require('dotenv').config();

/**
 * Appends a new lead row to the Google Sheet only if the email doesn't exist.
 * @param {Object} leadData - { name, businessEmail }
 */
const addLeadToSheet = async (leadData) => {
    const sheetId = process.env.GOOGLE_SHEET_ID;
    const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;

    if (!sheetId || !clientEmail || !privateKey) {
        throw new Error('Missing Google Sheets credentials in .env');
    }

    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: clientEmail,
                private_key: privateKey.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });
        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch emails to check for duplicates
        const getResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1!B:B',
        });

        const rows = getResponse.data.values || [];
        const existingEmails = rows.map(row => row[0] ? row[0].toLowerCase().trim() : "");
        const newEmail = leadData.businessEmail.toLowerCase().trim();

        if (existingEmails.includes(newEmail)) {
            console.log(`Duplicate found: ${newEmail}. Sync skipped.`);
            return { status: 'duplicate', message: 'Lead already registered.' };
        }

        const values = [[
            leadData.name,
            leadData.businessEmail,
            new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
        ]];

        await sheets.spreadsheets.values.append({
            spreadsheetId: sheetId,
            range: 'Sheet1!A:C',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values },
        });

        console.log('New lead added to Google Sheet.');
        return { status: 'success', message: 'Lead intake successful.' };
    } catch (error) {
        console.error('Sheet sync failed:', error.message);
        throw error;
    }
};

module.exports = { addLeadToSheet };
