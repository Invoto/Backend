const multer = require('multer');
const path = require('path');

const Paths = {
    UPLOAD_PATH_TEMP: "uploads",
};

const uploaderStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, Paths.UPLOAD_PATH_TEMP);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const uploader = multer({ storage: uploaderStorage });

const ConfigTryNow = {
    ALLOWED_FILE_TYPES: [
        "image/png",
        "image/jpeg"
    ],
};

const ConfigVolunteer = {
    ALLOWED_FILE_TYPES: [
        "image/png",
        "image/jpeg"
    ],
};

module.exports = {
    uploader,
    ConfigTryNow,
    ConfigVolunteer,
};
