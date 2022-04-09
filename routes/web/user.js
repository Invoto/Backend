var express = require('express');
var router = express.Router();

const { CheckRequestAuthed } = require("../../middleware/AuthMiddleware");
const controllerUsers = require("../../controllers/UsersController");

router.get("/", CheckRequestAuthed, function (req, res, next) {
    controllerUsers.getUserAccount(req, res);
});

module.exports = router;
