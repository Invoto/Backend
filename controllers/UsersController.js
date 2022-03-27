const { isLoginDataValid, isRegisterDataValid } = require("../helpers/validators/users");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { comparePassword } = require("../helpers/encrypt");
const { generateTokenForUser } = require("../helpers/tokens");

const { DataTypes } = require("sequelize");
const db = require("../models");
const User = require("../models/User")(db.sequelize, DataTypes);

async function loginUser(req, res) {
    let email = req.body.email;
    let password = req.body.password;

    let validationResponse = isLoginDataValid(email, password);
    if (validationResponse[0]) {
        const users = await User.findAll({
            where: {
                email: email,
            },
        });

        if (users.length == 0) {
            res.status(ResponseStatusCodes.NOT_FOUND).json(getFailureResponse({
                message: "No User Found",
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
            })
        }
    }
    else {
        res.status(ResponseStatusCodes.VALIDATION_ERROR).json(getFailureResponse({
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
    loginUser,
    registerUser,
};
