
const ResponseStatusCodes = {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    NOT_ACCEPTABLE: 406,
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
