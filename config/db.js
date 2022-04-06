
module.exports = {
    "development": {
        "dialect": "mysql",
    },
    "test": {
        "dialect": "mysql",
    },
    "production": {
        "dialect": "postgres",
        "protocol": "postgres",
        "dialectOptions": {
            "ssl": {
                require: true,
                rejectUnauthorized: false,
            },
        },
    }
};
