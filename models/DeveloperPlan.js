import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const DeveloperProfile = require("./DeveloperProfile")(sequelize);

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
    DeveloperPlan.hasMany(DeveloperProfile);

    return DeveloperPlan;
};
