const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios').default;
const { ConfigTryNow } = require("../config/uploads");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { isFetchDataValid } = require("../helpers/validators/extractions");

const { DataTypes, Op } = require("sequelize");
const db = require("../models");
const Extraction = require("../models/Extraction")(db.sequelize, DataTypes);
const User = require("../models/User")(db.sequelize, DataTypes);

async function tryNow(req, res) {
    let imageFile = req.file;

    if (!ConfigTryNow.ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
        res.status(ResponseStatusCodes.BAD_REQUEST).json(getFailureResponse({
            message: "Invalid File Format",
        }));
    }
    else {
        fs.readFile(imageFile.path, (err, imageFileData) => {
            if (err) {
                res.json(getFailureResponse({
                    message: "Internal Server Error in Handling Files.",
                }));
            }
            else {
                const form = new FormData();
                form.append("invoice_file", imageFileData, imageFile.originalname);

                axios({
                    method: "POST",
                    baseURL: process.env.INVOTO_EXTRACTOR_URL,
                    url: "/invoker",
                    headers: {
                        ...form.getHeaders(),
                    },
                    data: form,
                    validateStatus: () => true,
                }).then((resExtractor) => {
                    console.log(resExtractor.data);
                    if (resExtractor.data.status) {
                        Extraction.create({
                            usageType: "TRYNOW",
                            extractorJobID: resExtractor.data.job_id,
                        }).then((extraction) => {
                            res.json(getSuccessResponse({
                                extraction_id: extraction.id,
                            }));
                        });
                    }
                    else {
                        res.json(getFailureResponse({
                            message: "Internal Server Error",
                        }));
                    }
                }).catch((error) => {
                    res.json(getFailureResponse({
                        message: error.message,
                    }));
                });
            }
        });
    }
}

async function fetchJob(req, res) {
    let extractionID = req.params.id;

    let validationResponse = isFetchDataValid(extractionID);
    if (validationResponse[0]) {
        let user = req.user;
        var extraction;

        if (user) {
            extraction = await Extraction.findOne({
                where: {
                    id: extractionID,
                    "Users.id": user.id,
                },
                include: [{
                    model: User,
                    as: User.tableName,
                }],
            });
        }
        else {
            extraction = await Extraction.findOne({
                where: {
                    id: extractionID
                },
            });
        }

        if (extraction) {
            axios({
                method: "GET",
                baseURL: process.env.INVOTO_EXTRACTOR_URL,
                url: `/jobs/${extraction.extractorJobID}`,
                validateStatus: () => true,
            }).then((responseExtractor) => {
                res.json(getSuccessResponse({
                    job_status: responseExtractor.data.status,
                    outputs: responseExtractor.data.outputs,
                }));
            }).catch((error) => {
                res.json(getFailureResponse({
                    message: error.message
                }));
            });
        }
        else {
            res.json(getFailureResponse({
                message: "No such extraction found.",
            }));
        }
    }
    else {
        res.status(ResponseStatusCodes.BAD_REQUEST).json(getFailureResponse({
            message: validationResponse[1],
        }));
    }
}

module.exports = {
    tryNow,
    fetchJob,
};
