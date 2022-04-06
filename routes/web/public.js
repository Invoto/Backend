var express = require('express');
var router = express.Router();

const controllerExtraction = require("../../controllers/ExtractionController");
const controllerVolunteer = require("../../controllers/VolunteerController");

const { uploader } = require("../../config/uploads");

// Route for Try-It-Now
router.post("/try", uploader.single("imageFile"), function (req, res, next) {
    controllerExtraction.tryNow(req, res);
});

// Route for Volunteer
router.post("/volunteer", uploader.single("imageFile"), function (req, res, next) {
    controllerVolunteer.publicVolunteer(req, res);
});

module.exports = router;
