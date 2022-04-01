const jwt = require('jsonwebtoken');
const configAuth = require("../config/auth");

function generateTokenForUser(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
    }, process.env.INVOTO_TOKEN_SECRET, { expiresIn: configAuth.Tokens.EXPIRY_TIME });
}

function verifyToken(token, onSuccess, onFailure) {
    jwt.verify(token, process.env.INVOTO_TOKEN_SECRET, (err, user) => {
        if (!err) {
            onSuccess(user);
        }
        else {
            onFailure(err);
        }
    })
}

module.exports = {
    generateTokenForUser,
    verifyToken,
};
