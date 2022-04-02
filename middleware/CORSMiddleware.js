const configCORS = require("../config/cors");

function EnableCORSAllowWildCard(req, res, next) {
    for (const [headerKey, headerValue] of Object.entries(configCORS.RESPONSE_HEADERS)) {
        res.setHeader(headerKey, headerValue);
    }

    next();
}

module.exports = {
    EnableCORSAllowWildCard,
};
