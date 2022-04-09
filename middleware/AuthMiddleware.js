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
                    console.log(error);
                    res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                        message: error.message,
                    }));
                });
            }, (err) => {
                res.status(ResponseStatusCodes.UNAUTHORIZED).send(getFailureResponse({
                    message: "Unauthorized",
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
            verifyToken(authToken, (user) => {
                req.user = user;
                next();
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

module.exports = {
    CheckRequestAuthed,
    NonFailingCheckRequestAuthed,
};
