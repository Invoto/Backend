var express = require('express');
var router = express.Router();

const controllerUsers = require("../../controllers/UsersController");
const { CheckRequestAuthed } = require("../../middleware/AuthMiddleware");

router.post("/login", function (req, res, next) {
    controllerUsers.loginUser(req, res);
});

router.post("/forgot", function (req, res, next) {
    controllerUsers.forgotPassword(req, res);
});

router.post("/register", function (req, res, next) {
    controllerUsers.registerUser(req, res);
});

// Only the Routes below this middleware are affected by this.
router.use(CheckRequestAuthed);

router.get("/", function (req, res, next) {
    controllerUsers.isAuth(req, res);
});

module.exports = router;
