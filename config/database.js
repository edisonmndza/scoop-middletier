// Importing libraries
const Sequelize = require ("sequelize");


// setting up the connection to the postgres database
<<<<<<< HEAD
const db = new Sequelize("postgres", "postgres", "123456", {
=======
const db = new Sequelize("scoopdb", "postgres", "123456", {
>>>>>>> 185864b4bca5fc97df53374c20b0a458bd272b4d
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