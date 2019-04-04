const express = require("express");
const database = require("../config/database");
const userModel = database.import("../models/users");
const crypto = require("crypto");
const router = express.Router();

// Generate a random string to generate the salt
var genRandomString = function(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // converts to hex format
    .slice(0, length);
};

// Encrpting the password using crypto and sha512
var sha512 = function(password, salt) {
  var hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value
  };
};

// Bridge function to encrpyt the password
function saltHashPassword(userPassword) {
  var salt = genRandomString(16); //creates 16 random characters
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

router.post("/", (request, response) => {
  const { firstname, lastname, email, password } = request.body;

  // Encrypting the password
  passwordData = saltHashPassword(password);

  // Inserting the data into the database
  userModel
    .create({
      firstname: firstname,
      lastname: lastname,
      email: email,
      salt: passwordData.salt,
      passwordhash: passwordData.passwordHash
    })
    .then(() => {
      userModel
        .findAll({
          attributes: ["userid"],
          where: {
            email: email
          }
        })
        .then(results => {
          const userid = results[0].userid;
          response.send(`Success ${userid.toString()}`);
        });
    });
});

module.exports = router;
