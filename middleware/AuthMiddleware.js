const { ResponseStatusCodes } = require("../consts/responses");
const { getFailureResponse } = require("../helpers/responses");
const { verifyToken } = require("../helpers/tokens");

const db = require("../models");

function CheckRequestAuthed(req, res, next) {
    let authHeader = req.headers["authorization"];

    if (authHeader) {
        let authToken = authHeader.split(" ")[1];

        if (authToken) {
            verifyToken(authToken, (tokenUser) => {
                db.User.findOne({
                    where: {
                        id: tokenUser.id,
                        email: tokenUser.email,
                    },
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
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else {
                        res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                            message: "Invalid Token/User has been removed.",
                        }));
                    }
                }).catch((error) => {
                    res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                        message: error.message,
                    }));
                });
            }, (err) => {
                res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                    message: err.message,
                }));
            });
        }
        else {
            res.status(ResponseStatusCodes.NOT_ACCEPTABLE).send(getFailureResponse({
                message: "Invalid Token",
            }));
        }
    }
    else {
        res.status(ResponseStatusCodes.BAD_REQUEST).send(getFailureResponse({
            message: "No Authorization Header",
        }));
    }
}

function NonFailingCheckRequestAuthed(req, res, next) {
    let authHeader = req.headers["authorization"];

    if (authHeader) {
        let authToken = authHeader.split(" ")[1];

        if (authToken) {
            verifyToken(authToken, (tokenUser) => {
                db.User.findOne({
                    where: {
                        id: tokenUser.id,
                        email: tokenUser.email,
                    },
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
                    if (user) {
                        req.user = user;
                        next();
                    }
                    else {
                        next();
                    }
                }).catch((error) => {
                    next();
                });
            }, (err) => {
                next();
            });
        }
        else {
            next();
        }
    }
    else {
        next();
    }
}

function CheckAPIRequestAuthed(req, res, next) {
    let authHeader = req.headers["authorization"];

    if (authHeader) {
        let apiKey = authHeader.split(" ")[1];

        if (apiKey) {
            db.DeveloperProfile.findOne({
                where: {
                    apiKey: apiKey,
                },
            }).then((developerProfile) => {
                if (developerProfile) {
                    db.User.findOne({
                        where: {
                            DeveloperProfileId: developerProfile.id,
                        },
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
                        if (user) {
                            req.user = user;
                            next();
                        }
                        else {
                            res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                                message: "Invalid API Key/User has been removed.",
                            }));
                        }
                    }).catch((error) => {
                        res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                            message: error.message,
                        }));
                    });
                }
                else {
                    res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                        message: "Invalid API Key/User has been removed.",
                    }));
                }
            }).catch((error) => {
                res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                    message: error.message,
                }));
            });
        }
        else {
            res.status(ResponseStatusCodes.NOT_ACCEPTABLE).send(getFailureResponse({
                message: "Invalid Token",
            }));
        }
    }
    else {
        res.status(ResponseStatusCodes.BAD_REQUEST).send(getFailureResponse({
            message: "No Authorization Header",
        }));
    }
}

module.exports = {
    CheckRequestAuthed,
    NonFailingCheckRequestAuthed,
    CheckAPIRequestAuthed,
};
