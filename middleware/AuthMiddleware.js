const { ResponseStatusCodes } = require("../consts/responses");
const { getFailureResponse } = require("../helpers/responses");
const { verifyToken } = require("../helpers/tokens");

const { DataTypes } = require("sequelize");
const db = require("../models");
const User = require("../models/User")(db.sequelize, DataTypes);

function CheckRequestAuthed(req, res, next) {
    let authHeader = req.headers["authorization"];

    if (authHeader) {
        let authToken = authHeader.split(" ")[1];

        if (authToken) {
            verifyToken(authToken, (user) => {
                req.user = user;
                next();
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
