const Sequelize = require("sequelize");

export const sequelize = new Sequelize(
  'db_test',
  'root',
  'root',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
