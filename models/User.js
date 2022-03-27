'use strict';
const {
    Model
} = require('sequelize');
const { hashPassword } = require("../helpers/encrypt");

module.exports = (sequelize, DataTypes) => {
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
    User.associate = function (models) {
        User.hasOne(models.ConsumerProfile);
        User.hasOne(models.DeveloperProfile);
        User.hasMany(models.Extraction);
        User.hasMany(models.VolunteeredDocument);
    };

    return User;
};
