const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios').default;
const { ConfigExtract } = require("../config/uploads");
const { uploadFileToExtractionStorage, getBucketExtractionURL } = require("../helpers/storage");
const { ResponseStatusCodes } = require("../consts/responses");
const { getSuccessResponse, getFailureResponse } = require("../helpers/responses");
const { Op } = require("sequelize");

const db = require("../models");

async function extract(req, res, next) {
    let imageFile = req.file;
    let user = req.user ? req.user : null;
    let userId = user ? user.id : null;
    let usageType = req.usageType;

    if (!ConfigExtract.ALLOWED_FILE_TYPES.includes(imageFile.mimetype)) {
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
                        const createExtraction = (imageURL) => {
                            db.Extraction.create({
                                usageType: usageType,
                                extractorJobID: resExtractor.data.job_id,
                                imageURL: imageURL,
                                UserId: userId,
                            }).then((extraction) => {
                                res.json(getSuccessResponse({
                                    extraction_id: extraction.id,
                                }));

                                res.usedQuota = 1;

                                if (next) {
                                    next();
                                }
                            }).catch((error) => {
                                res.json(getFailureResponse({
                                    message: error.message,
                                }));
                            });
                        };

                        uploadFileToExtractionStorage(imageFile, (data) => {
                            let imageFileURL = getBucketExtractionURL(imageFile);
                            createExtraction(imageFileURL);
                            removeTempInvoiceFile(imageFile.path);
                        }, (error) => {
                            createExtraction(null);
                            removeTempInvoiceFile(imageFile.path);
                        });
                    }
                    else {
                        res.json(getFailureResponse({
                            message: "Internal Server Error",
                        }));

                        removeTempInvoiceFile(imageFile.path);
                    }
                }).catch((error) => {
                    res.json(getFailureResponse({
                        message: error.message,
                    }));

                    removeTempInvoiceFile(imageFile.path);
                });
            }
        });
    }
}

function getUserExtractions(req, res) {
    var filterQuery = {};
    let user = req.user;
    if (user) {
        filterQuery.UserId = user.id;
    }
    else {
        filterQuery.UserId = null; // This assures only public extractions are fetched when it is requested from public endpoint.
    }

    let extractionId = req.params.id;
    if (extractionId) {
        filterQuery.id = extractionId;
    }

    let usageType = req.query.usageType;
    if (usageType) {
        filterQuery.usageType = usageType;
    }
    else {
        filterQuery[Op.or] = [
            { usageType: "CONSUMER" },
            { usageType: "DEVELOPER" },
        ];

        if (!user) {
            filterQuery[Op.or].push({ usageType: "TRYNOW" });
        }
    }

    let shouldIncludeOutputs = req.query.reqOutputs;

    const getOutputExtractions = (extractions) => {
        return extractions.map((extraction) => {
            delete extraction.dataValues["extractorJobID"];
            return extraction;
        });
    }

    const includeExtractions = (extractions, idx) => {
        const processExtractorResponse = (extractions, idx, jobStatus, outputs, error) => {
            extractions[idx].dataValues.jobStatus = jobStatus;
            extractions[idx].dataValues.outputs = outputs;

            if (error) {
                extractions[idx].dataValues.outputError = error.message;
            }

            if (idx == extractions.length - 1) {
                res.json(getSuccessResponse({
                    extractions: getOutputExtractions(extractions),
                }));
            }
            else {
                includeExtractions(extractions, idx + 1);
            }
        };

        let extraction = extractions[idx];

        axios({
            method: "GET",
            baseURL: process.env.INVOTO_EXTRACTOR_URL,
            url: `/jobs/${extraction.extractorJobID}`,
            validateStatus: () => true,
        }).then((responseExtractor) => {
            processExtractorResponse(extractions, idx, responseExtractor.data.status, responseExtractor.data.outputs, null);
        }).catch((error) => {
            processExtractorResponse(extractions, idx, null, [], error);
        });
    };

    db.Extraction.findAll({
        where: filterQuery,
        attributes: { exclude: ["UserId"] },
    }).then((extractions) => {
        if (extractions.length > 0) {
            if (shouldIncludeOutputs) {
                includeExtractions(extractions, 0);
            }
            else {
                res.json(getSuccessResponse({
                    extractions: getOutputExtractions(extractions),
                }));
            }
        }
        else {
            res.json(getSuccessResponse({
                extractions: [],
            }));
        }
    }).catch((error) => {
        res.json(getFailureResponse({
            message: error.message,
        }));
    });
}

module.exports = {
    extract,
    getUserExtractions,
};
