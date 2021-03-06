'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const configDB = require("../config/db");
const { consumerPlans, developerPlans } = require("../config/plans");
const db = {};

let sequelize = new Sequelize(process.env["DATABASE_URL"], configDB[process.env["NODE_ENV"]]);

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

async function syncDatabase(onComplete) {
  sequelize.sync({
    alter: true,
  }).then(onComplete);
}

function populateInitialPlans(onComplete) {
  let promisesConsumer = consumerPlans.map(async (consumerPlan) => {
    await db["ConsumerPlan"].findOrCreate({
      where: consumerPlan,
      defaults: consumerPlan,
    });
  });

  Promise.all(promisesConsumer).then(() => {
    let promisesDeveloper = developerPlans.map(async (developerPlan) => {
      await db["DeveloperPlan"].findOrCreate({
        where: developerPlan,
        defaults: developerPlan,
      });
    });

    Promise.all(promisesDeveloper).then(onComplete);
  });
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.sync = syncDatabase;
db.populateInitialPlans = populateInitialPlans;

module.exports = db;
