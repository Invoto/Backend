var express = require('express');
var router = express.Router();

const controllerExtraction = require("../../controllers/ExtractionController");
const controllerVolunteer = require("../../controllers/VolunteerController");
const controllerMailingList = require("../../controllers/MailingListController");

const { uploader } = require("../../config/uploads");

// Route for Try-It-Now
router.post("/try", uploader.single("imageFile"), function (req, res, next) {
    req.usageType = "TRYNOW";
    controllerExtraction.extract(req, res);
});

// Router for monitoring the request after trying-it-now
router.get("/try-monitor/:id", function (req, res, next) {
    controllerExtraction.getUserExtractions(req, res);
});

// Route for Volunteer
router.post("/volunteer", uploader.single("imageFile"), function (req, res, next) {
    controllerVolunteer.volunteer(req, res);
});

// Route for Newsletter Subscriptions
router.post("/subscribe", function (req, res, next) {
    controllerMailingList.addToSubscribers(req, res);
});

module.exports = router;
