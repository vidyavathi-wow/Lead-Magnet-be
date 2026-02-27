const { BrevoClient } = require('@getbrevo/brevo');
const { getConsolidatedNotificationTemplate } = require('../templates/emailTemplates');
require('dotenv').config();

// Initialize the client
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY,
});

/**
 * Sends a consolidated notification email for both lead capture and score completion
 * @param {Object} notificationData - {
 *   name, businessEmail,
 *   totalScore (optional), maturityLabel (optional), scores (optional),
 *   classification (optional), isAbandoned (optional)
 * }
 */
const sendNotification = async (notificationData) => {
    try {
        const { name, businessEmail, totalScore, maturityLabel, isAbandoned, scores, classification } = notificationData;

        // Determine subject based on whether we have score data
        let subject;
        if (totalScore === undefined || totalScore === null) {
            // Lead just captured, no score yet
            subject = `🚀 New Lead Captured: ${name}`;
        } else if (isAbandoned) {
            subject = `🔔 Lead Audit Abandoned: ${name}`;
        } else if (totalScore === 0) {
            subject = `🔔 Lead Score: 0 | ${name}`;
        } else {
            subject = `🔔 Lead – ${maturityLabel} | ${name} scored ${totalScore}/125`;
        }

        // Section names mapping
        const sectionNames = {
            governance: 'Governance & Oversight',
            adoption: 'Internal & Tenant Digital Adoption',
            collection: 'Revenue & Cash Flow Digitization',
            integration: 'System Architecture & Data Integrity',
            compliance: 'Compliance & Risk Readiness'
        };

        // Replace "You are" or "Your" in the description to third-person
        let leadDescription = classification ? classification.description : '';
        if (leadDescription) {
            leadDescription = leadDescription.replace(/You are/gi, `${name} is`).replace(/Your/gi, `${name}'s`);
        }

        console.log(`📧 Sending notification for: ${name} <${businessEmail}> | Subject: ${subject}`);

        const result = await brevo.transactionalEmails.sendTransacEmail({
            subject: subject,
            htmlContent: getConsolidatedNotificationTemplate({
                name,
                businessEmail,
                totalScore,
                maturityLabel,
                scores,
                sectionNames,
                classification,
                leadDescription,
                isAbandoned
            }),
            sender: {
                name: process.env.SENDER_NAME || "Wow Realty Lead Magnet",
                email: process.env.SENDER_EMAIL
            },
            to: [
                { email: process.env.DUMMY_EMAIL_1 },
                { email: process.env.DUMMY_EMAIL_2 }
            ].filter(recipient => recipient.email)
        });

        console.log(`✅ Notification sent to team: ${process.env.DUMMY_EMAIL_1}, ${process.env.DUMMY_EMAIL_2}`);
        return result;
    } catch (error) {
        console.error('Error sending notification:', error.message);
        throw error;
    }
};

module.exports = { sendNotification };