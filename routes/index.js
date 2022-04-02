var express = require('express');
var router = express.Router();

const { EnableCORSAllowWildCard } = require("../middleware/CORSMiddleware");
const { AllowHeadersByConfig } = require("../middleware/HeadersMiddleware");

// CORS Whitelisting.
router.use(EnableCORSAllowWildCard);
// Enabling Other Headers
router.use(AllowHeadersByConfig);

// Imports should come below since all routes must be CORS enabled.
const routerWeb = require("./web");
const routerAPI = require("./api");

router.use("/", routerWeb);
router.use("/api", routerAPI);

module.exports = router;
