const { ResponseStatusCodes } = require("../consts/responses");
const { getFailureResponse } = require("../helpers/responses");

function CheckDeveloperPlanQuota(req, res, next) {
    let user = req.user;

    user.getDeveloperProfile().then((developerProfile) => {
        if (developerProfile) {
            developerProfile.getDeveloperPlan().then((developerPlan) => {
                if (developerPlan) {
                    let isQuotaExceeded = developerPlan.quota != -1 && developerProfile.usageQuota >= developerPlan.quota;

                    if (isQuotaExceeded) {
                        res.status(ResponseStatusCodes.TOO_MANY_REQUESTS).json(getFailureResponse({
                            message: "Quota Exceeded",
                        }));
                    }
                    else {
                        next();
                    }
                }
                else {
                    res.status(ResponseStatusCodes.UNEXPECTED_ERROR).json(getFailureResponse({
                        message: "Unexpected error.",
                    }));
                }
            }).catch((error) => {
                res.status(ResponseStatusCodes.UNEXPECTED_ERROR).json(getFailureResponse({
                    message: error.message,
                }));
            });
        }
        else {
            res.status(ResponseStatusCodes.UNEXPECTED_ERROR).json(getFailureResponse({
                message: "Unexpected error.",
            }));
        }
    }).catch((error) => {
        res.status(ResponseStatusCodes.UNEXPECTED_ERROR).json(getFailureResponse({
            message: error.message,
        }));
    });
}

function UpdateDeveloperPlanQuota(req, res, next) {
    let user = req.user;
    let reqUsedQuota = res.usedQuota;

    user.getDeveloperProfile().then((developerProfile) => {
        developerProfile.set({
            usageQuota: developerProfile.usageQuota + reqUsedQuota,
        });

        developerProfile.save().then((updatedDeveloperProfile) => {
            user.setDeveloperProfile(updatedDeveloperProfile).then(() => {

            }).catch((error) => {
                // Temporary code. This should be designed to retry to update the quota.
                console.log("=========================================");
                console.log("Quota update failed for user: " + user.id);
                console.log("Error Message: " + error.message);
                console.log("Error Stack: \n" + error);
                console.log("=========================================");
            });
        })
    }).catch((error) => {
        // Temporary code. This should be designed to retry to update the quota.
        console.log("=========================================");
        console.log("Quota update failed for user: " + user.id);
        console.log("Error Message: " + error.message);
        console.log("Error Stack: \n" + error);
        console.log("=========================================");
    });
}

module.exports = {
    CheckDeveloperPlanQuota,
    UpdateDeveloperPlanQuota
};
