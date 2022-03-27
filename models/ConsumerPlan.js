import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const ConsumerProfile = require("./ConsumerProfile")(sequelize);

    class ConsumerPlan extends Model { }

    ConsumerPlan.init({

    }, {
        sequelize,
        modelName: "ConsumerPlan",
    });

    /* Relationships */
    ConsumerPlan.hasMany(ConsumerProfile);

    return ConsumerPlan;
};
