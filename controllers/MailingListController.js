const { isSubscriptionRequestValid } = require("../helpers/validators/emails");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { addSubscriberToMailingList } = require("../helpers/emails");

async function addToSubscribers(req, res) {
    let email = req.body.email;

    let validationResponse = isSubscriptionRequestValid(email);
    if (validationResponse[0]) {
        addSubscriberToMailingList({
            email: email,
        }, () => {
            res.json(getSuccessResponse());
        }, (error) => {
            res.json(getFailureResponse({
                message: error.message,
            }));
        });
    }
    else {
        res.status(ResponseStatusCodes.BAD_REQUEST).json(getFailureResponse({
            message: validationResponse[1],
        }));
    }
}

module.exports = {
    addToSubscribers,
};
