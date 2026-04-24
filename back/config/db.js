const { Sequelize } = require('sequelize');
const path = require('path');

require('dotenv').config({
  path: 'C:/Users/compu1/FinFlow_BackEnd/back/conexion.env'
});

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    port: process.env.DB_PORT
  }
);

module.exports = sequelize;
console.log("PASS:", process.env.DB_PASSWORD);
console.log("USER:", process.env.DB_USER);
console.log("DB:", process.env.DB_NAME);