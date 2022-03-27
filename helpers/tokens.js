const jwt = require('jsonwebtoken');
const configAuth = require("../config/auth");

function generateTokenForUser(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.INVOTO_TOKEN_SECRET, { expiresIn: configAuth.Tokens.EXPIRY_TIME });
}

module.exports = {
    generateTokenForUser,
}
