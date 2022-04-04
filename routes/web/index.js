var express = require('express');
var router = express.Router();

const routerAuth = require("./auth");
const routerPublic = require("./public");
const routerExtractions = require("./extractions");

router.use("/auth", routerAuth);
router.use("/public", routerPublic);
router.use("/extractions", routerExtractions);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

module.exports = router;
