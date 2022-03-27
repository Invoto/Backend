import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const User = require("./User")(sequelize);

    class Extraction extends Model { }

    Extraction.init({
        usageType: {
            type: DataTypes.ENUM("CONSUMER", "DEVELOPER", "TRYNOW"),
            allowNull: false,
        },
        extractorJobID: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "Extraction",
    });

    /* Relationships */
    Extraction.belongsTo(User); // Optional

    return Extraction;
};
