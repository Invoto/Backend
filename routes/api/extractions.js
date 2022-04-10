var express = require('express');
var router = express.Router();

const { CheckAPIRequestAuthed } = require("../../middleware/AuthMiddleware");
const { CheckDeveloperPlanQuota, UpdateDeveloperPlanQuota } = require("../../middleware/UserPlanQuotaMiddleware");

const controllerExtraction = require("../../controllers/ExtractionController");

const { uploader } = require("../../config/uploads");

router.post("/", [CheckAPIRequestAuthed, CheckDeveloperPlanQuota], uploader.single("imageFile"), function (req, res, next) {
    req.usageType = "DEVELOPER";
    controllerExtraction.extract(req, res, next);
}, [UpdateDeveloperPlanQuota]);

router.get("/:id", [CheckAPIRequestAuthed], function (req, res, next) {
    req.query.usageType = "DEVELOPER";
    controllerExtraction.getUserExtractions(req, res);
});

module.exports = router;
