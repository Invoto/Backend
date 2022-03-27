var express = require('express');
var router = express.Router();

const routerWeb = require("./web");
const routerAPI = require("./api");

router.use("/", routerWeb);
router.use("/api", routerAPI);

module.exports = router;
