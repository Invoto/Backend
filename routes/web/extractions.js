var express = require('express');
var router = express.Router();

const { CheckRequestAuthed } = require("../../middleware/AuthMiddleware");
const controllerExtraction = require("../../controllers/ExtractionController");

const { uploader } = require("../../config/uploads");

router.post("/", CheckRequestAuthed, uploader.single("imageFile"), function (req, res, next) {
    req.usageType = "CONSUMER";
    controllerExtraction.extract(req, res);
});

router.get("/:id?", CheckRequestAuthed, function (req, res, next) {
    controllerExtraction.getExtractions(req, res);
});

module.exports = router;
