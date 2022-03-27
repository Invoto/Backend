'use strict';
const {
    Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class ConsumerProfile extends Model { }

    ConsumerProfile.init({
        usedQuota: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, {
        sequelize,
        modelName: "ConsumerProfile",
    });

    /* Relationships */
    ConsumerProfile.associate = function (models) {
        ConsumerProfile.belongsTo(models.User, {
            // Mandatory to have a User Profile.
            foreignKey: {
                allowNull: false,
            }
        });
        ConsumerProfile.belongsTo(models.ConsumerPlan, {
            // Mandatory to have a Consumer Plan.
            foreignKey: {
                allowNull: false,
            }
        });
    }

    return ConsumerProfile;
};
