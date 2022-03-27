'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ConsumerPlan extends Model { }

    ConsumerPlan.init({
        quota: {
            type: DataTypes.INTEGER,
            defaultValue: -1, // -1 Means Infinite
        }
    }, {
        sequelize,
        modelName: "ConsumerPlan",
    });

    /* Relationships */
    ConsumerPlan.associate = function (models) {
        ConsumerPlan.hasMany(models.ConsumerProfile);
    };

    return ConsumerPlan;
};
