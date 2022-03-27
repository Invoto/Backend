import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const User = require("./User")(sequelize);
    const ConsumerPlan = require("./ConsumerPlan")(sequelize);

    class ConsumerProfile extends Model { }

    ConsumerProfile.init({
        usedQuota: {
            type: DataTypes.INTEGER,
        }
    }, {
        sequelize,
        modelName: "ConsumerProfile",
    });

    /* Relationships */
    ConsumerProfile.belongsTo(User, {
        // Mandatory to have a User Profile.
        foreignKey: {
            allowNull: false,
        }
    });
    ConsumerProfile.belongsTo(ConsumerPlan, {
        // Mandatory to have a Consumer Plan.
        foreignKey: {
            allowNull: false,
        }
    });

    return ConsumerProfile;
};
