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
        console.log(`Checking duplicates in ${rows.length} rows for email: ${leadData.businessEmail}`);

        const newEmail = leadData.businessEmail.toLowerCase().trim();

        // Removed duplicate check so that users can take the audit multiple times
        // and each attempt gets logged in the spreadsheet.

        console.log(`Adding new lead to sheet: ${leadData.name} <${newEmail}>`);

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

/**
 * Updates an existing lead row with audit results.
 * @param {Object} scoreData - { name, businessEmail, totalScore, maturityLabel, scores, isAbandoned }
 */
const updateLeadWithScore = async (scoreData) => {
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

        // 1. Find the row index by searching for the email
        const getResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: sheetId,
            range: 'Sheet1!B:B',
        });

        const rows = getResponse.data.values || [];
        const emailToFind = scoreData.businessEmail.toLowerCase().trim();
        console.log(`Searching for email: "${emailToFind}" in ${rows.length} rows`);

        // Find the LAST occurrence to update the most recent test attempt
        const existingEmails = rows.map(row => row[0] ? row[0].toLowerCase().trim() : "");
        const rowIndex = existingEmails.lastIndexOf(emailToFind);

        const status = scoreData.isAbandoned ? 'Abandoned' : 'Completed';
        const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });

        if (rowIndex === -1) {
            console.log(`Lead not found for email: ${emailToFind}. Appending as new row to handle race conditions.`);
            const newRow = [
                scoreData.name || 'Unknown',
                scoreData.businessEmail,
                timestamp,
                scoreData.totalScore || 0,
                scoreData.maturityLabel || 'N/A',
                status,
                timestamp
            ];

            if (scoreData.scores) {
                const sectionKeys = ['governance', 'adoption', 'collection', 'integration', 'compliance'];
                sectionKeys.forEach(key => {
                    newRow.push(scoreData.scores[key] || 0);
                });
            }

            await sheets.spreadsheets.values.append({
                spreadsheetId: sheetId,
                range: 'Sheet1!A:L',
                valueInputOption: 'USER_ENTERED',
                requestBody: { values: [newRow] },
            });

            console.log(`Appended full new row for ${emailToFind} at the end of the sheet.`);
            return { status: 'success', message: 'Score appended successfully as new row.' };
        }

        const actualRow = rowIndex + 1; // 1-indexed for Sheets

        // 2. Prepare update values
        // Column D: Total Score, E: Maturity, F: Status (Completed/Abandoned), G: Timestamp, H+: Individual Scores

        const updateValues = [
            scoreData.totalScore || 0,
            scoreData.maturityLabel || 'N/A',
            status,
            timestamp
        ];

        // Add individual section scores if available
        if (scoreData.scores) {
            // Assuming 5 sections as per auditData.ts
            const sectionKeys = ['governance', 'adoption', 'collection', 'integration', 'compliance'];
            sectionKeys.forEach(key => {
                updateValues.push(scoreData.scores[key] || 0);
            });
        }

        await sheets.spreadsheets.values.update({
            spreadsheetId: sheetId,
            range: `Sheet1!D${actualRow}`,
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [updateValues] },
        });

        console.log(`Lead score updated for ${emailToFind} at row ${actualRow}.`);
        return { status: 'success', message: 'Score updated successfully.' };

    } catch (error) {
        console.error('Sheet update failed:', error.message);
        throw error;
    }
};

module.exports = { addLeadToSheet, updateLeadWithScore };
