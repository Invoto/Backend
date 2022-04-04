var express = require('express');
var router = express.Router();

const controllerExtraction = require("../../controllers/ExtractionController");

const { Paths } = require("../../config/uploads");
const multer = require("multer");

const uploadTryNow = multer({
    dest: Paths.UPLOAD_PATH_TEMP,
});

// Route for Try-It-Now
router.post("/try", uploadTryNow.single("imageFile"), function (req, res, next) {
    controllerExtraction.tryNow(req, res);
});

module.exports = router;
