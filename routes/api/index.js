var express = require('express');
var router = express.Router();

const routerExtractions = require("./extractions");

router.use("/extractions", routerExtractions);

module.exports = router;
