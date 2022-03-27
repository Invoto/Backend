const bcrypt = require('bcrypt');

function hashPassword(user) {
    if (user === null) {
        throw new Error("User not found");
    }
    else if (!user.changed("password")) {
        return user.password;
    }
    else {
        let salt = bcrypt.genSaltSync();
        return user.password = bcrypt.hashSync(user.password, salt);
    }
}

function comparePassword(plainTextPassword, hashedPassword, onSuccess, onFailure) {
    bcrypt.compare(plainTextPassword, hashedPassword, function (err, result) {
        if (result) {
            onSuccess();
        }
        else {
            onFailure(err);
        }
    });
}

module.exports = {
    hashPassword,
    comparePassword,
};
