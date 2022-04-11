var express = require('express');
var router = express.Router();

const { CheckRequestAuthed } = require("../../middleware/AuthMiddleware");
const controllerVolunteer = require("../../controllers/VolunteerController");

const { uploader } = require("../../config/uploads");

router.post("/", CheckRequestAuthed, uploader.single("imageFile"), function (req, res, next) {
    controllerVolunteer.volunteer(req, res);
});

router.get("/:id?", CheckRequestAuthed, function (req, res, next) {
    controllerVolunteer.getVolunteeredDocuments(req, res);
});

module.exports = router;
