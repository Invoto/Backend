var express = require('express');
var router = express.Router();

const { CheckRequestAuthed } = require("../../middleware/AuthMiddleware");
const controllerExtraction = require("../../controllers/ExtractionController");

router.post("/", CheckRequestAuthed, function (req, res, next) {
    req.usageType = "CONSUMER";
    controllerExtraction.extract(req, res);
});

router.get("/:id?", CheckRequestAuthed, function (req, res, next) {
    controllerExtraction.getUserExtractions(req, res);
});

module.exports = router;
