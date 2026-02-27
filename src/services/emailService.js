// const { BrevoClient } = require('@getbrevo/brevo');
// const { getLeadNotificationTemplate, getScoreNotificationTemplate } = require('../templates/emailTemplates');
// require('dotenv').config();

// // Initialize the client
// const brevo = new BrevoClient({
//     apiKey: process.env.BREVO_API_KEY,
// });

// /**
//  * Sends a notification email when a new lead is captured
//  * @param {Object} leadData - { name, businessEmail }
//  */
// const sendLeadNotification = async (leadData) => {
//     try {
//         console.log(`Attempting to send notification for: ${leadData.name} <${leadData.businessEmail}>`);

//         const result = await brevo.transactionalEmails.sendTransacEmail({
//             subject: `🚀 New Lead Captured: ${leadData.name}`,
//             htmlContent: getLeadNotificationTemplate(leadData),
//             sender: {
//                 name: process.env.SENDER_NAME || "Wow Realty Lead Magnet",
//                 email: process.env.SENDER_EMAIL
//             },
//             to: [
//                 { email: process.env.DUMMY_EMAIL_1 },
//                 { email: process.env.DUMMY_EMAIL_2 }
//             ].filter(recipient => recipient.email)
//         });

//         console.log(`✅ Lead capture email sent to team: ${process.env.DUMMY_EMAIL_1}, ${process.env.DUMMY_EMAIL_2}`);
//         return result;
//     } catch (error) {
//         console.error('Error sending email through Brevo:', error.message);
//         throw error;
//     }
// };

// /**
//  * Sends a score notification email
//  * @param {Object} scoreData - { name, businessEmail, totalScore, maturityLabel, isAbandoned }
//  */
// const sendScoreNotification = async (scoreData) => {
//     try {
//         const { name, businessEmail, totalScore, maturityLabel, isAbandoned, scores, classification } = scoreData;
//         console.log(`📋 Processing score for lead: ${name} <${businessEmail}> | Score: ${totalScore} | Label: ${maturityLabel} | Abandoned: ${isAbandoned}`);

//         let subject, title, subtitle, color;

//         if (isAbandoned) {
//             subject = `🔔 New Lead – Audit Abandoned: ${name}`;
//             title = `Lead Captured: ${name}`;
//             subtitle = `This lead started the assessment but did not complete it.<br>Score recorded as <strong>0</strong>.`;
//             color = "#888888";
//         } else if (totalScore === 0) {
//             subject = `🔔 New Lead – Score: 0 | ${name}`;
//             title = `Lead Captured: ${name}`;
//             subtitle = `Audit complete. Score: <strong>0/125</strong>.<br>Critical digital gaps detected — follow up recommended.`;
//             color = "#e74c3c";
//         } else {
//             subject = `🔔 New Lead – ${maturityLabel} | ${name} scored ${totalScore}/125`;
//             title = `Lead Captured: ${name}`;
//             subtitle = `Audit complete. Score: <strong>${totalScore}/125</strong> &mdash; Classification: <strong>${maturityLabel}</strong>`;
//             color = "#d4af37";
//         }

//         // Section names mapping
//         const sectionNames = {
//             governance: 'Governance & Oversight',
//             adoption: 'Internal & Tenant Digital Adoption',
//             collection: 'Revenue & Cash Flow Digitization',
//             integration: 'System Architecture & Data Integrity',
//             compliance: 'Compliance & Risk Readiness'
//         };

//         // Replace "You are" or "Your" in the description to third-person
//         let leadDescription = classification ? classification.description : '';
//         if (leadDescription) {
//             leadDescription = leadDescription.replace(/You are/gi, `${name} is`).replace(/Your/gi, `${name}'s`);
//         }

//         const result = await brevo.transactionalEmails.sendTransacEmail({
//             subject: subject,
//             htmlContent: getScoreNotificationTemplate({
//                 title, color, subtitle, name, businessEmail, maturityLabel, scores, sectionNames, classification, leadDescription, isAbandoned
//             }),
//             sender: {
//                 name: process.env.SENDER_NAME || "Wow Realty Lead Magnet",
//                 email: process.env.SENDER_EMAIL
//             },
//             to: [
//                 { email: process.env.DUMMY_EMAIL_1 },
//                 { email: process.env.DUMMY_EMAIL_2 }
//             ]
//         });

//         console.log(`✅ Score email sent to team: ${process.env.DUMMY_EMAIL_1}, ${process.env.DUMMY_EMAIL_2}`);
//         return result;
//     } catch (error) {
//         console.error('Error sending score notification:', error.message);
//         throw error;
//     }
// };

// module.exports = { sendLeadNotification, sendScoreNotification };



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