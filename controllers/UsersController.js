const { isRegisterDataValid } = require("../helpers/validators/users");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");

const { DataTypes } = require("sequelize");
const db = require("../models");
const User = require("../models/User")(db.sequelize, DataTypes);

async function registerUser(req, res) {
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let passwordRepeat = req.body.passwordRepeat;

    let validationResponse = isRegisterDataValid(name, email, password, passwordRepeat);
    if (validationResponse[0]) {
        const existingUserCount = await User.count({
            where: {
                email: email,
            },
        });

        if (existingUserCount == 0) {
            await User.create({
                email: email,
                password: password,
                fullName: name,
                consumerProfile: {
                    usedQuota: 0,
                },
                developerProfile: {
                    usedQuota: 0,
                }
            });

            res.json(getSuccessResponse({}));
        }
        else {
            res.status(ResponseStatusCodes.RESOURCE_EXISTS).json(getFailureResponse({
                message: "Email already in use.",
            }));
        }
    }
    else {
        res.status(ResponseStatusCodes.VALIDATION_ERROR).json(getFailureResponse({
            message: validationResponse[1],
        }));
    }
}

module.exports = {
    registerUser,
};
