const Joi = require('joi');

const schemaLogin = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(3).max(15).required(),
});

const schemaForgot = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
});

const schemaRegister = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    password: Joi.string().min(3).max(15).required().label('Password'),
    passwordRepeat: Joi.any().equal(Joi.ref('password')).required().label('Confirmation').messages({ 'any.only': '{{#label}} does not match' }),
});

function isLoginDataValid(email, password) {
    let result = schemaLogin.validate({
        email: email,
        password: password,
    });

    if (!result.error) {
        return [!result.error, ""];
    }
    else {
        return [!result.error, result.error["message"]];
    }
}

function isForgotValid(email) {
    let result = schemaForgot.validate({
        email: email,
    });

    if (!result.error) {
        return [!result.error, ""];
    }
    else {
        return [!result.error, result.error["message"]];
    }
}

function isRegisterDataValid(name, email, password, passwordRepeat) {
    let result = schemaRegister.validate({
        name: name,
        email: email,
        password: password,
        passwordRepeat: passwordRepeat,
    });

    if (!result.error) {
        return [!result.error, ""];
    }
    else {
        return [!result.error, result.error["message"]];
    }
}

module.exports = {
    isLoginDataValid,
    isForgotValid,
    isRegisterDataValid,
};
