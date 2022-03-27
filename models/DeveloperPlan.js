import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const DeveloperProfile = require("./DeveloperProfile")(sequelize);

    class DeveloperPlan extends Model { }

    DeveloperPlan.init({

    }, {
        sequelize,
        modelName: "DeveloperPlan",
    });

    /* Relationships */
    DeveloperPlan.hasMany(DeveloperProfile);

    return DeveloperPlan;
};
