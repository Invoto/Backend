'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class VolunteeredDocument extends Model { }

    VolunteeredDocument.init({
        imageURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        labels: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        sequelize,
        modelName: "VolunteeredDocument",
    });

    /* Relationships */
    VolunteeredDocument.associate = function (models) {
        VolunteeredDocument.belongsTo(models.User); // Optional Participation
    }

    return VolunteeredDocument;
};
