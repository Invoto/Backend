const { isLoginDataValid, isForgotValid, isRegisterDataValid } = require("../helpers/validators/users");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { comparePassword } = require("../helpers/encrypt");
const { generateTokenForUser } = require("../helpers/tokens");
const { generatePassword } = require("../helpers/passwords");
const { sendEmail } = require("../helpers/emails");

const db = require("../models");

async function isAuth(req, res) {
    res.json(getSuccessResponse({}));
}

async function loginUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    let validationResponse = isLoginDataValid(email, password);
    if (validationResponse[0]) {
        db.User.findAll({
            where: {
                email: email,
            },
        }).then((users) => {
            if (users.length == 0) {
                res.status(ResponseStatusCodes.NOT_FOUND).json(getFailureResponse({
                    message: "No Such User Found",
                }));
            }
            else {
                const user = users[0];
                comparePassword(password, user.password, () => {
                    const token = generateTokenForUser(user);
                    res.json(getSuccessResponse({
                        token: token,
                    }));
                }, (err) => {
                    res.json(getFailureResponse({
                        message: "Incorrect Password",
                    }));
                });
            }
        }).catch((error) => {
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

async function forgotPassword(req, res) {
    let email = req.body.email;

    let validationResponse = isForgotValid(email);
    if (validationResponse[0]) {
        db.User.findAll({
            where: {
                email: email,
            },
        }).then((users) => {
            if (users.length == 0) {
                res.status(ResponseStatusCodes.NOT_FOUND).json(getFailureResponse({
                    message: "No Such User Found",
                }));
            }
            else {
                const user = users[0];

                let newPassword = generatePassword();
                user.set({
                    password: newPassword,
                });

                user.save().then((updatedUser) => {
                    let emailBody = "You've requested a password reset in Invoto. Please use the following password to login the next time.\nPassword: " + newPassword + "\n";
                    let emailHTMLBody = "<p>" + emailBody + "</p>";
                    sendEmail("noreply@invoto.ml", email, "Password Reset Request", emailBody, emailHTMLBody, () => {
                        res.json(getSuccessResponse({}));
                    }, (error) => {
                        res.json(getFailureResponse({
                            message: error.message,
                        }));
                    });
                }).catch((error) => {
                    res.json(getFailureResponse({
                        message: error.message,
                    }));
                });
            }
        }).catch((error) => {
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

async function registerUser(req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let passwordRepeat = req.body.passwordRepeat;

    let validationResponse = isRegisterDataValid(name, email, password, passwordRepeat);
    if (validationResponse[0]) {
        db.User.count({
            where: {
                email: email,
            },
        }).then((existingUserCount) => {
            if (existingUserCount == 0) {
                // Until plans are introduced to user accounts, we will use the default plan with unlimited quota.
                db.ConsumerPlan.findOne({
                    where: {
                        quota: -1,
                    }
                }).then((consumerPlan) => {
                    if (consumerPlan) {
                        db.DeveloperPlan.findOne({
                            where: {
                                quota: -1,
                            }
                        }).then((developerPlan) => {
                            if (developerPlan) {
                                db.User.create({
                                    email: email,
                                    password: password,
                                    fullName: name,
                                    ConsumerProfile: {
                                        usedQuota: 0,
                                        ConsumerPlanId: consumerPlan.id,
                                    },
                                    DeveloperProfile: {
                                        usedQuota: 0,
                                        DeveloperPlanId: developerPlan.id,
                                    }
                                }, {
                                    include: [
                                        {
                                            model: db.ConsumerProfile,
                                            include: [db.ConsumerPlan],
                                        },
                                        {
                                            model: db.DeveloperProfile,
                                            include: [db.DeveloperPlan],
                                        },
                                    ]
                                }).then((user) => {
                                    res.json(getSuccessResponse({}));
                                }).catch((error) => {
                                    res.json(getFailureResponse({
                                        message: error.message,
                                    }));
                                });
                            }
                            else {
                                res.json(getFailureResponse({
                                    message: "Developer Plan not found.",
                                }));
                            }
                        }).catch((error) => {
                            res.json(getFailureResponse({
                                message: error.message,
                            }));
                        });
                    }
                    else {
                        res.json(getFailureResponse({
                            message: "Consumer Plan not found.",
                        }));
                    }
                }).catch((error) => {
                    res.json(getFailureResponse({
                        message: error.message,
                    }));
                });
            }
            else {
                res.status(ResponseStatusCodes.RESOURCE_EXISTS).json(getFailureResponse({
                    message: "Email already in use.",
                }));
            }
        }).catch((error) => {
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

async function getUserAccount(req, res) {
    let user = req.user;

    res.json(getSuccessResponse(user.toJSON()));
}

module.exports = {
    isAuth,
    loginUser,
    forgotPassword,
    registerUser,
    getUserAccount,
};
