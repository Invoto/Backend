const { ResponseStatusMessages } = require("../consts/responses");

function getSuccessResponse(data) {
    return {
        status: ResponseStatusMessages.SUCCESS,
        ...data,
    };
}

function getFailureResponse(data) {
    return {
        status: ResponseStatusMessages.FAILURE,
        ...data,
    };
}

module.exports = {
    getSuccessResponse,
    getFailureResponse,
}
