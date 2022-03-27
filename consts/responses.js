
const ResponseStatusCodes = {
    SUCCESS: 200,
    VALIDATION_ERROR: 400,
    NOT_FOUND: 404,
    RESOURCE_EXISTS: 409,
}

const ResponseStatusMessages = {
    SUCCESS: true,
    FAILURE: false,
};

module.exports = {
    ResponseStatusCodes,
    ResponseStatusMessages,
};
