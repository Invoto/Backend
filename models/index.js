'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const configDB = require("../config/db");
const db = {};

let sequelize = new Sequelize(process.env["DATABASE_URL"], {
  dialect: configDB[process.env["NODE_ENV"]]["dialect"]
});

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

async function syncDatabase() {
  await sequelize.sync({ alter: true });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sync = syncDatabase;

module.exports = db;
