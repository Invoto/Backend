const Joi = require('joi');

const schemaFetch = Joi.object({
    id: Joi.string().required(),
});

function isFetchDataValid(id) {
    let result = schemaFetch.validate({
        id: id,
    });

    if (!result.error) {
        return [!result.error, ""];
    }
    else {
        return [!result.error, result.error["message"]];
    }
}

module.exports = {
    isFetchDataValid,
};
