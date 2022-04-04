var express = require('express');
var router = express.Router();

const { NonFailingCheckRequestAuthed } = require("../../middleware/AuthMiddleware");
const controllerExtraction = require("../../controllers/ExtractionController");

router.get("/:id", NonFailingCheckRequestAuthed, function (req, res, next) {
    controllerExtraction.fetchJob(req, res);
});

module.exports = router;
