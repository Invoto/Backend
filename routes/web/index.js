var express = require('express');
var router = express.Router();

const routerAuth = require("./auth");

router.use("/auth", routerAuth);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
