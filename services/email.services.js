const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

// Set up email service
const sendMail = async (to, subject, body) => {
    try {
        const msg = {
            to: to,
            from: 'tanviransari13@gmail.com',
            subject: subject,
            html:body
        }
        await sgMail.send(msg);
        return true;
    }
    catch (err) {
        console.log(err);
        
        throw new Error('Email could not be send.');
    }
}

module.exports = sendMail;
