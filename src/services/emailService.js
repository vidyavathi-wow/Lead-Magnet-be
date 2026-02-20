const { BrevoClient } = require('@getbrevo/brevo');
require('dotenv').config();

const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

const sendLeadNotification = async (leadData) => {
    try {
        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: `New Lead Captured: ${leadData.name}`,
            htmlContent: `
                <html>
                    <body>
                        <h1>New Lead Alert!</h1>
                        <p>A new user has requested access to the audit.</p>
                        <ul>
                            <li><strong>Name:</strong> ${leadData.name}</li>
                            <li><strong>Email:</strong> ${leadData.businessEmail}</li>
                        </ul>
                    </body>
                </html>
            `,
            sender: { 
                name: process.env.SENDER_NAME || "Wow Realty Lead Magnet", 
                email: process.env.SENDER_EMAIL 
            },
            to: [
                { email: process.env.DUMMY_EMAIL_1 },
                { email: process.env.DUMMY_EMAIL_2 }
            ]
        });

        console.log('Email sent successfully:', result);
        return result;
    } catch (error) {
        console.error('Error sending email through Brevo:', error);
        throw error;
    }
};

module.exports = { sendLeadNotification };
