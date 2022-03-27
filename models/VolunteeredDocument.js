import { DataTypes, Model } from '@sequelize/core';

module.exports = (sequelize) => {
    const User = require("./User")(sequelize);

    class VolunteeredDocument extends Model { }

    VolunteeredDocument.init({
        imageURL: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        labels: {
            type: DataTypes.JSON,
            allowNull: true,
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
        }
    }, {
        sequelize,
        modelName: "VolunteeredDocument",
    });

    /* Relationships */
    VolunteeredDocument.belongsTo(User); // Optional

    return VolunteeredDocument;
};
