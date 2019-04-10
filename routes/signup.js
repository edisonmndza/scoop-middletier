const express = require("express");
const database = require("../config/database");
const userModel = database.import("../models/users");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const fs = require("fs");
const router = express.Router();

var path = "../scoop-middle-tier/private.key";
var privatekey = fs.readFileSync(path, "utf8");

var genRandomString = function(length) {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString("hex") // converts to hex format
    .slice(0, length);
};

var sha512 = function(password, salt) {
  var hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  var value = hash.digest("hex");
  return {
    salt: salt,
    passwordHash: value
  };
};

function saltHashPassword(userPassword) {
  var salt = genRandomString(16); //creates 16 random characters
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

function checkHashPassword(userPassword, salt) {
  var passwordData = sha512(userPassword, salt);
  return passwordData;
}

router.post("/register", (request, response) => {
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
          const userid = results[0].userid; // grabbing the user id

          // validing a token for the successfully signed up user
          // token payload contains the user id
          jwt.sign({ userid: userid }, privatekey, (err, token) => {
            if (err) {
              console.log(err);
            }
            console.log(userid); // user id
            console.log(token); // token that was created
            response.send(token); // send the token as the server response to a successful register
          });
        });
    });
});

router.post("/login", (request, response) => {
  const { email, password } = request.body;
  userModel
    .findAll({
      attributes: ["userid", "passwordhash", "salt"],
      where: {
        email: email
      }
    })
    .then(result => {
      salt = result[0].salt;
      pw = result[0].passwordhash;
      userid = result[0].userid;
      passwordData = checkHashPassword(password, salt);
      if (pw == passwordData.passwordHash) {
        // on successful log in
        console.log(userid.toString());

        // signing a jwt token for the user that has successfully logged in
        // storing their user id in the token payload
        jwt.sign({ userid: userid }, privatekey, (err, token) => {
          if (err) {
            console.log(err);
          }
          console.log(token);
          response.json(token); // server sends the token containing the user id as a response
        });
      } else {
        response.send("Incorrect Password");
      }
    })
    .catch(function(err) {
      if (err) {
        console.log(err);
        response.send("Invalid Email");
      }
    });
});

module.exports = router;
