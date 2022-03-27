var express = require('express');
var router = express.Router();

const controllerUsers = require("../../controllers/UsersController");

router.post("/register", function (req, res, next) {
    controllerUsers.registerUser(req, res);
});

module.exports = router;
