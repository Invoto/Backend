'use strict';
const {
    Model
} = require('sequelize');
const generateApiKey = require('generate-api-key');

module.exports = (sequelize, DataTypes) => {
    class DeveloperProfile extends Model { }

    DeveloperProfile.init({
        apiKey: {
            type: DataTypes.STRING,
            defaultValue: () => {
                return generateApiKey();
            },
        },
        usageQuota: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        }
    }, {
        sequelize,
        modelName: "DeveloperProfile",
    });

    /* Relationships */
    DeveloperProfile.associate = function (models) {
        DeveloperProfile.belongsTo(models.User, {
            // Mandatory to have a User Profile.
            foreignKey: {
                allowNull: false,
            }
        });
        DeveloperProfile.belongsTo(models.DeveloperPlan, {
            // Mandatory to have a Developer Plan.
            foreignKey: {
                allowNull: false,
            }
        });
    }

    return DeveloperProfile;
};
