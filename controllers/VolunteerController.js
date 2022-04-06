const { uploadFileToStorage, getBucketURL } = require("../helpers/storage");
const { ConfigVolunteer } = require("../config/uploads");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");

const { DataTypes, Op } = require("sequelize");
const db = require("../models");
const VolunteeredDocument = require("../models/VolunteeredDocument")(db.sequelize, DataTypes);

function publicVolunteer(req, res) {
    let imageFile = req.file;

    if (!ConfigVolunteer.ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
        res.status(ResponseStatusCodes.BAD_REQUEST).json(getFailureResponse({
            message: "Invalid File Format",
        }));
    }
    else {
        uploadFileToStorage(imageFile, (data) => {
            let imageFileURL = getBucketURL(imageFile);
            VolunteeredDocument.create({
                imageURL: imageFileURL,
                isValidated: false,
            }).then((volDoc) => {
                res.json(getSuccessResponse(volDoc.get({ plain: true })));
            });
        }, (error) => {
            res.json(getFailureResponse({
                message: error.message,
            }));
        });
    }
}

module.exports = {
    publicVolunteer,
}
