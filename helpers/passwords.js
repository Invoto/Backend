var generator = require('generate-password');

function generatePassword() {
    return generator.generate({
        length: 10,
        numbers: true,
    });
}

module.exports = {
    generatePassword,
};
