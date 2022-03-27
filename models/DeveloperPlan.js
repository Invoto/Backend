'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class DeveloperPlan extends Model { }

    DeveloperPlan.init({
        quota: {
            type: DataTypes.INTEGER,
            defaultValue: -1, // -1 Means Infinite
        }
    }, {
        sequelize,
        modelName: "DeveloperPlan",
    });

    /* Relationships */
    DeveloperPlan.associate = function (models) {
        DeveloperPlan.hasMany(models.DeveloperProfile);
    }

    return DeveloperPlan;
};
