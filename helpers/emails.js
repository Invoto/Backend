const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.INVOTO_SENDGRID_API_KEY);

function sendEmail(from, to, subject, body, htmlBody, onSuccess, onFailure) {
    const email = {
        to: to,
        from: from,
        subject: subject,
        text: body,
        html: htmlBody,
    };

    sgMail.send(email).then(() => {
        onSuccess();
    }, (error) => {
        onFailure(error);
    });
}

module.exports = {
    sendEmail,
};
