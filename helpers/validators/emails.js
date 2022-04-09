const Joi = require('joi');

const schemaNewsletterSubscription = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

function isSubscriptionRequestValid(email) {
    let result = schemaNewsletterSubscription.validate({
        email: email,
    });

    if (!result.error) {
        return [!result.error, ""];
    }
    else {
        return [!result.error, result.error["message"]];
    }
}

module.exports = {
    isSubscriptionRequestValid,
};
