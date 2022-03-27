
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

module.exports = { hashPassword };
