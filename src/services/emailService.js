const { BrevoClient } = require('@getbrevo/brevo');
require('dotenv').config();

// Initialize the client
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

/**
 * Sends a notification email when a new lead is captured
 * @param {Object} leadData - { name, businessEmail }
 */
const sendLeadNotification = async (leadData) => {
    try {
        console.log(`Attempting to send notification for: ${leadData.name} <${leadData.businessEmail}>`);
        console.log(`Recipients from ENV: ${process.env.DUMMY_EMAIL_1}, ${process.env.DUMMY_EMAIL_2}`);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: `🚀 New Lead Captured: ${leadData.name}`,
            htmlContent: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                    <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
                        <h1 style="color: #d4af37; margin: 0;">New Audit Lead</h1>
                        <p style="color: #666; font-size: 16px;">A new professional has requested access to the Digital Maturity Audit.</p>
                    </div>
                    <div style="padding: 20px;">
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 150px;">Full Name</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${leadData.name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Business Email</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">
                                    <a href="mailto:${leadData.businessEmail}" style="color: #d4af37; text-decoration: none;">${leadData.businessEmail}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 10px 0; color: #888;">Capture Date</td>
                                <td style="padding: 10px 0;">${new Date().toLocaleString()}</td>
                            </tr>
                        </table>
                    </div>
                    <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
                        This notification was sent automatically from your Lead Magnet system.
                    </div>
                </div>
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

        console.log('Email successfully sent through Brevo.');
        return result;
    } catch (error) {
        console.error('Error sending email through Brevo:', error.message);
        throw error;
    }
};

module.exports = { sendLeadNotification };
