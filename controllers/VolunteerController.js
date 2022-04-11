const fs = require('fs');
const { uploadFileToVolunteerStorage, getBucketVolunteerURL } = require("../helpers/storage");
const { ConfigVolunteer } = require("../config/uploads");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");

const db = require("../models");

function volunteer(req, res) {
    let imageFile = req.file;
    let user = req.user ? req.user : null;
    let userId = user ? user.id : null;

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

        uploadFileToVolunteerStorage(imageFile, (data) => {
            let imageFileURL = getBucketVolunteerURL(imageFile);
            db.VolunteeredDocument.create({
                imageURL: imageFileURL,
                isValidated: false,
                UserId: userId,
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

function getVolunteeredDocuments(req, res) {
    var filterQuery = {};
    let user = req.user;
    if (user) {
        filterQuery.UserId = user.id;
    }
    else {
        filterQuery.UserId = null; // This assures only public extractions are fetched when it is requested from public endpoint.
    }

    let volunteerId = req.params.id;
    if (volunteerId) {
        filterQuery.id = volunteerId;
    }

    db.VolunteeredDocument.findAll({
        where: filterQuery,
        attributes: { exclude: ["UserId"] },
    }).then((vDocs) => {
        if (vDocs.length > 0) {
            res.json(getSuccessResponse({
                volunteeredDocuments: vDocs,
            }));
        }
        else {
            res.json(getSuccessResponse({
                volunteeredDocuments: [],
            }));
        }
    }).catch((error) => {
        res.json(getFailureResponse({
            message: error.message,
        }));
    });
}

module.exports = {
    volunteer,
    getVolunteeredDocuments,
}
