import { DataTypes, Model } from '@sequelize/core';
import { hashPassword } from "../helpers/encrypt";

module.exports = (sequelize) => {
    const ConsumerProfile = require("./ConsumerProfile")(sequelize);
    const DeveloperProfile = require("./DeveloperProfile")(sequelize);
    const Extraction = require("./Extraction")(sequelize);
    const VolunteeredDocument = require("./VolunteeredDocument")(sequelize);

    class User extends Model { }

    User.init({
        email: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        fullName: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        modelName: "User",
    });

    User.beforeCreate(hashPassword);
    User.beforeUpdate(hashPassword);

    /* Relationships */
    User.hasOne(ConsumerProfile);
    User.hasOne(DeveloperProfile);
    User.hasMany(Extraction);
    User.hasMany(VolunteeredDocument);

    return User;
};
