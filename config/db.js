
module.exports = {
    "development": {
        "dialect": "mysql",
    },
    "test": {
        "dialect": "mysql",
    },
    "production": {
        "dialect": "postgres",
        "dialectOptions": {
            "ssl": {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
};
