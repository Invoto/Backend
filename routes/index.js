var express = require('express');
var router = express.Router();

const configCORS = require("../config/cors");

const routerWeb = require("./web");
const routerAPI = require("./api");

// CORS Whitelisting.
router.use((req, res, next) => {
    for (const [headerKey, headerValue] of Object.entries(configCORS.RESPONSE_HEADERS)) {
        res.setHeader(headerKey, headerValue);
    }

    next();
})

router.use("/", routerWeb);
router.use("/api", routerAPI);

module.exports = router;
