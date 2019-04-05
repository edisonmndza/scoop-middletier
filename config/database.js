// Importing libraries
const Sequelize = require("sequelize");


// setting up the connection to the postgres database
const db = new Sequelize('scoop', "postgres", "password", {
  host: "localhost",
  port: "5432",
  dialect: "postgres",
  operatorAliases: false,
  define: {
    timestamps: false
  },

  // to keep database connections open so they can be reused by others
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});


// Exporting database to be used in other .js files
module.exports = db;