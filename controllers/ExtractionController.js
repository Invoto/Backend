const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios').default;
const { ConfigTryNow } = require("../config/uploads");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { isFetchDataValid } = require("../helpers/validators/extractions");

const db = require("../models");

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
                    if (resExtractor.data.status) {
                        db.xtraction.create({
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
            extraction = await db.Extraction.findOne({
                where: {
                    id: extractionID,
                    "Users.id": user.id,
                },
                include: [{
                    model: db.User,
                    as: db.User.tableName,
                }],
            });
        }
        else {
            extraction = await db.Extraction.findOne({
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
