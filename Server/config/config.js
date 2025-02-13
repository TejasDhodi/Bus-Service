const Sequelize = require("sequelize");
require("dotenv").config({path: "../.env"});
const sequelize = new Sequelize(process.env.DB_URI, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false,
    dialectOptions: {
        ssl: {
        require: true,
        rejectUnauthorized: false
        }
    }
});

module.exports = sequelize;