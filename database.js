require('dotenv').config();
const { Sequelize } = require("sequelize");
require('mysql2')

const db = new Sequelize({
    dialect: process.env.DATABASE_TYPE,
    logging: process.env.DATABASE_LOG ? console.log : false,
    host: process.env.DATABASE_HOST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    timezone: '+00:00',
    define: {
        timestamps: false
    }
});

module.exports = db;

module.exports.openConnection = () => {
    return db.authenticate().then(() => {
        console.log("Database is connected")
    }).catch(err => { console.log(err) });
}

module.exports.closeConnection = () => {
    return db.close().then(() => {
        console.log("Database connection is closed")
    }).catch(err => { console.log(err) });
}