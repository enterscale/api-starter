const sendGridEmail = require('@sendgrid/mail');
require('dotenv').config();
sendGridEmail.setApiKey(process.env.SENDGRID_API_KEY);


function sendMailWithTemplate(to, from, sendGridTemplateId, dynamic_template_data) {
    const msg = { to: `${to.name} <${to.email}>`, from:`${from.name} <${from.email}>`, templateId: sendGridTemplateId, dynamic_template_data };

    try {
        sendGridEmail.send(msg);
        return true;
    } catch (error) {
        console.log('Email NOT Sent', error);
        return false;
    }
}

function sendEmail(to, from, subject, html) {
    const msg = { to: `${to.name} <${to.email}>`, from:`${from.name} <${from.email}>`, subject, text: 'mooyi', html };
    try {
        sendGridEmail.send(msg);
        return true;
    } catch (error) {
        console.log('Email NOT Sent', error);
        return false;
    }
}

module.exports = {
    sendMailWithTemplate,
    sendEmail
}