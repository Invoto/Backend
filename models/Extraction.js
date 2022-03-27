'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Extraction extends Model { }

    Extraction.init({
        usageType: {
            type: DataTypes.ENUM("CONSUMER", "DEVELOPER", "TRYNOW"),
            allowNull: false,
        },
        extractorJobID: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Extraction",
    });

    /* Relationships */
    Extraction.associate = function (models) {
        Extraction.belongsTo(models.User); // Optional Participation
    }

    return Extraction;
};
