const fs = require('fs');
const { uploadFileToStorage, getBucketURL } = require("../helpers/storage");
const { ConfigVolunteer } = require("../config/uploads");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");

const db = require("../models");

function publicVolunteer(req, res) {
    let imageFile = req.file;

    if (!ConfigVolunteer.ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
        res.status(ResponseStatusCodes.BAD_REQUEST).json(getFailureResponse({
            message: "Invalid File Format",
        }));
    }
    else {
        const removeTempInvoiceFile = (filePath) => {
            fs.unlink(filePath, (err) => {
                if (!err) {
                    console.log("Successfully removed: " + filePath);
                }
                else {
                    console.log("Failed to remove temp file. Error: " + err.message);
                }
            });
        };

        uploadFileToStorage(imageFile, (data) => {
            let imageFileURL = getBucketURL(imageFile);
            db.VolunteeredDocument.create({
                imageURL: imageFileURL,
                isValidated: false,
            }).then((volDoc) => {
                res.json(getSuccessResponse(volDoc.get({ plain: true })));

                removeTempInvoiceFile(imageFile.path);
            }).catch((error) => {
                res.json(getFailureResponse({
                    message: error.message,
                }));

                removeTempInvoiceFile(imageFile.path);
            });
        }, (error) => {
            res.json(getFailureResponse({
                message: error.message,
            }));

            removeTempInvoiceFile(imageFile.path);
        });
    }
}

module.exports = {
    publicVolunteer,
}
