import { DataTypes, Model } from '@sequelize/core';
import generateApiKey from 'generate-api-key';

module.exports = (sequelize) => {
    const User = require("./User")(sequelize);
    const DeveloperPlan = require("./DeveloperPlan")(sequelize);

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
        }
    }, {
        sequelize,
        modelName: "DeveloperProfile",
    });

    /* Relationships */
    DeveloperProfile.belongsTo(User, {
        // Mandatory to have a User Profile.
        foreignKey: {
            allowNull: false,
        }
    });
    DeveloperProfile.belongsTo(DeveloperPlan, {
        // Mandatory to have a Developer Plan.
        foreignKey: {
            allowNull: false,
        }
    });

    return DeveloperProfile;
};
