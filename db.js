const Sequelize = require('sequelize');
const config = require("./config");
let fs = require('fs');
require('dotenv').config();

let NODE_ENV = process.env.NODE_ENV;

console.log('check => ', NODE_ENV);

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_DIALECT = process.env.DB_DIALECT;

const DB_URL = `postgres:${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}`;
const dialect = DB_DIALECT;


let databaseOptions = {
    logging: false,
    dialect,
    pool: {
        max: 1,
        min: 0,
        idle: 10000,
        acquire: 1000000,
    },
};

const sequelize = new Sequelize(DB_URL, databaseOptions);

sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

sequelize.sync({ alter: true });

module.exports = sequelize;