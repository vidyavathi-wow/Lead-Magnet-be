// const getLeadNotificationTemplate = (leadData) => {
//     return `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//                     <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-radius: 10px 10px 0 0;">
//                         <h1 style="color: #d4af37; margin: 0;">New Audit Lead</h1>
//                         <p style="color: #666; font-size: 16px;">A new professional has requested access to the Digital Maturity Audit.</p>
//                     </div>
//                     <div style="padding: 20px;">
//                         <table style="width: 100%; border-collapse: collapse;">
//                             <tr>
//                                 <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888; width: 150px;">Full Name</td>
//                                 <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">${leadData.name}</td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #888;">Business Email</td>
//                                 <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: bold;">
//                                     <a href="mailto:${leadData.businessEmail}" style="color: #d4af37; text-decoration: none;">${leadData.businessEmail}</a>
//                                 </td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 10px 0; color: #888;">Capture Date</td>
//                                 <td style="padding: 10px 0;">${new Date().toLocaleString()}</td>
//                             </tr>
//                         </table>
//                     </div>
//                     <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
//                         This notification was sent automatically from the Wow Realty Lead Magnet system.
//                     </div>
//                 </div>
//             `;
// };

// const getScoreNotificationTemplate = ({
//     title, color, subtitle, name, businessEmail, maturityLabel, scores, sectionNames, classification, leadDescription, isAbandoned
// }) => {
//     return `
//                 <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
//                     <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
//                         <h1 style="color: ${color}; margin: 0; font-size: 28px;">${title}</h1>
//                         <p style="color: #666; font-size: 16px; margin-top: 15px;">${subtitle}</p>
//                     </div>
//                     <div style="padding: 30px 20px;">
//                         <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">Lead Information</h3>
//                         <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
//                             <tr>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 150px;">Name</td>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${name}</td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Business Email</td>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${businessEmail}</td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Maturity Level</td>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: ${color};">${maturityLabel}</td>
//                             </tr>
//                             <tr>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Date / Time</td>
//                                 <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
//                             </tr>
//                         </table>

//                         ${scores ? `
//                             <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Assessment Breakdown</h3>
//                             <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
//                                 ${Object.keys(scores).map(key => `
//                                     <tr>
//                                         <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; color: #555;">${sectionNames[key] || key}</td>
//                                         <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; text-align: right; font-weight: bold;">${scores[key]}/25</td>
//                                     </tr>
//                                 `).join('')}
//                             </table>
//                         ` : ''}

//                         ${classification ? `
//                             <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Strategic Impact Analysis</h3>
//                             <div style="background-color: #fcfcfc; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
//                                 <p style="color: #444; font-style: italic; margin-top: 0;">${leadDescription}</p>
//                                 <ul style="padding-left: 20px; margin-bottom: 0; color: #555;">
//                                     ${classification.bullets.map(bullet => `<li style="margin-bottom: 8px;">${bullet}</li>`).join('')}
//                                 </ul>
//                             </div>
//                         ` : ''}
                        
//                         ${!isAbandoned ? `
//                             <div style="margin-top: 30px; padding: 20px; background-color: #fff9e6; border-radius: 8px; border: 1px solid #ffeeba;">
//                                 <h3 style="margin-top: 0; color: #856404;">Recommended Action</h3>
//                                 <p style="margin-bottom: 0; color: #856404; font-size: 14px;">This lead has completed the digital maturity audit. Consider reaching out with a tailored roadmap based on their results.</p>
//                             </div>
//                         ` : `
//                             <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 8px; border: 1px solid #e0e0e0;">
//                                 <h3 style="margin-top: 0; color: #666;">Recommended Action</h3>
//                                 <p style="margin-bottom: 0; color: #666; font-size: 14px;">This lead did not complete the audit. Consider following up to re-engage them with the assessment.</p>
//                             </div>
//                         `}
//                     </div>
//                     <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
//                         This is a consolidated assessment report from the Wow Realty Lead Magnet System.
//                     </div>
//                 </div>
//             `;
// };

// module.exports = {
//     getLeadNotificationTemplate,
//     getScoreNotificationTemplate
// };




const getConsolidatedNotificationTemplate = ({
    // Lead data
    name, businessEmail,
    // Score data (optional - can be null if lead just captured)
    totalScore, maturityLabel, scores, sectionNames, classification, leadDescription, isAbandoned
}) => {
    // Determine colors and messaging based on score data
    let title, subtitle, color;

    if (!totalScore && totalScore !== 0) {
        // Lead just captured, no score yet
        title = "New Lead Captured";
        subtitle = "A new professional has requested access to the Digital Maturity Audit.";
        color = "#d4af37";
    } else if (isAbandoned) {
        title = `Lead Captured: ${name}`;
        subtitle = `This lead started the assessment but did not complete it.<br>Score recorded as <strong>0</strong>.`;
        color = "#888888";
    } else if (totalScore === 0) {
        title = `Lead Captured: ${name}`;
        subtitle = `Audit complete. Score: <strong>0/125</strong>.<br>Critical digital gaps detected — follow up recommended.`;
        color = "#e74c3c";
    } else {
        title = `Lead Captured: ${name}`;
        subtitle = `Audit complete. Score: <strong>${totalScore}/125</strong> &mdash; Classification: <strong>${maturityLabel}</strong>`;
        color = "#d4af37";
    }

    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
            <div style="background-color: #f8f9fa; padding: 40px 20px; text-align: center; border-radius: 10px 10px 0 0;">
                <h1 style="color: ${color}; margin: 0; font-size: 28px;">${title}</h1>
                <p style="color: #666; font-size: 16px; margin-top: 15px;">${subtitle}</p>
            </div>
            <div style="padding: 30px 20px;">
                <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px; margin-top: 0;">Lead Information</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888; width: 150px;">Name</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${name}</td>
                    </tr>
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Business Email</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">
                            <a href="mailto:${businessEmail}" style="color: #d4af37; text-decoration: none;">${businessEmail}</a>
                        </td>
                    </tr>
                    ${totalScore !== undefined && totalScore !== null ? `
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Maturity Level</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold; color: ${color};">${maturityLabel}</td>
                    </tr>
                    ` : ''}
                    <tr>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; color: #888;">Date / Time</td>
                        <td style="padding: 12px 0; border-bottom: 1px solid #eee; font-weight: bold;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td>
                    </tr>
                </table>

                ${scores ? `
                    <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Assessment Breakdown</h3>
                    <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                        ${Object.keys(scores).map(key => `
                            <tr>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; color: #555;">${sectionNames[key] || key}</td>
                                <td style="padding: 10px 0; border-bottom: 1px solid #f9f9f9; text-align: right; font-weight: bold;">${scores[key]}/25</td>
                            </tr>
                        `).join('')}
                    </table>
                ` : ''}

                ${classification ? `
                    <h3 style="color: #333; border-bottom: 2px solid #f0f0f0; padding-bottom: 10px;">Strategic Impact Analysis</h3>
                    <div style="background-color: #fcfcfc; padding: 20px; border: 1px solid #f0f0f0; border-radius: 8px;">
                        <p style="color: #444; font-style: italic; margin-top: 0;">${leadDescription}</p>
                        <ul style="padding-left: 20px; margin-bottom: 0; color: #555;">
                            ${classification.bullets.map(bullet => `<li style="margin-bottom: 8px;">${bullet}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
                
                ${totalScore !== undefined && totalScore !== null ? `
                    ${!isAbandoned ? `
                        <div style="margin-top: 30px; padding: 20px; background-color: #fff9e6; border-radius: 8px; border: 1px solid #ffeeba;">
                            <h3 style="margin-top: 0; color: #856404;">Recommended Action</h3>
                            <p style="margin-bottom: 0; color: #856404; font-size: 14px;">This lead has completed the digital maturity audit. Consider reaching out with a tailored roadmap based on their results.</p>
                        </div>
                    ` : `
                        <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 8px; border: 1px solid #e0e0e0;">
                            <h3 style="margin-top: 0; color: #666;">Recommended Action</h3>
                            <p style="margin-bottom: 0; color: #666; font-size: 14px;">This lead did not complete the audit. Consider following up to re-engage them with the assessment.</p>
                        </div>
                    `}
                ` : `
                    <div style="margin-top: 30px; padding: 20px; background-color: #f8f8f8; border-radius: 8px; border: 1px solid #e0e0e0;">
                        <h3 style="margin-top: 0; color: #666;">Next Step</h3>
                        <p style="margin-bottom: 0; color: #666; font-size: 14px;">Awaiting audit completion. You will receive an updated notification once the lead completes the assessment.</p>
                    </div>
                `}
            </div>
            <div style="background-color: #f8f9fa; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
                This notification was sent from the Wow Realty Lead Magnet system.
            </div>
        </div>
    `;
};

module.exports = {
    getConsolidatedNotificationTemplate
};