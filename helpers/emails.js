const sgMail = require('@sendgrid/mail');
const sgClient = require('@sendgrid/client');

const { MailingLists } = require("../config/emails");

sgMail.setApiKey(process.env.INVOTO_SENDGRID_API_KEY);
sgClient.setApiKey(process.env.INVOTO_SENDGRID_API_KEY);

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

function getMailingListByName(listName, onRetreive, onNotFound, onError) {
    sgClient.request({
        method: "GET",
        url: `/v3/marketing/lists`,
    }).then(([response, body]) => {
        let mailingLists = response.body.result;

        if (mailingLists) {
            let mailingListArr = mailingLists.filter((mailingList, idx, arr) => {
                return mailingList.name == listName;
            });

            if (mailingListArr.length > 0) {
                onRetreive(mailingListArr[0]);
            }
            else {
                onNotFound();
            }
        }
        else {
            onNotFound();
        }
    }).catch((error) => {
        onError(error);
    });
}

function createMailingList(listName, onSuccess, onFailure) {
    sgClient.request({
        url: "/v3/marketing/lists",
        method: "POST",
        body: {
            name: listName,
        }
    }).then(([response, body]) => {
        let mailingList = response.body;
        onSuccess(mailingList);
    }).catch((error) => {
        onFailure(error);
    });
}

function addSubscriberToMailingList(subscriber, onSuccess, onFailure) {
    getMailingListByName(MailingLists.Subscriptions, (mailingList) => {
        // Now that the mailing list has been found we can add the subscriber.
        sgClient.request({
            url: "/v3/marketing/contacts",
            method: "PUT",
            body: {
                list_ids: [mailingList.id],
                contacts: [subscriber],
            },
        }).then(([response, body]) => {
            if (response.statusCode == 202) {
                onSuccess();
            }
            else {
                onFailure({
                    message: "Unexpected error encountered while subscribing.",
                });
            }
        }).catch(onFailure);
    }, () => {
        onFailure({
            message: "No such mailing list found.",
        });
    }, onFailure);
}

function createMailingListIfNotExist() {
    // Create only if not found.
    getMailingListByName(MailingLists.Subscriptions, (mailingList) => { }, () => {
        createMailingList(MailingLists.Subscriptions, () => {
            console.log("Mailing List Created Successfully.");
        }, (error) => {
            console.log("Failed to create mailing list. Error:");
            console.log(error);
        });
    }, (error) => {
        console.log("Failed to determine whether mailing list exists or not. Error:");
        console.log(error);
    });
}

module.exports = {
    sendEmail,
    getMailingListByName,
    createMailingList,
    addSubscriberToMailingList,
    createMailingListIfNotExist,
};
