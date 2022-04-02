const configHeaders = require("../config/headers");

function AllowHeadersByConfig(req, res, next) {
    for (const [headerKey, headerValue] of Object.entries(configHeaders.ALLOWED_HEADERS)) {
        res.setHeader(headerKey, headerValue);
    }

    next();
}

module.exports = {
    AllowHeadersByConfig,
};
