// importing libraries
const jwt = require("jsonwebtoken");
const fs = require("fs");

var path = "../scoop-middle-tier/private.key";
var privatekey = fs.readFileSync(path, "utf8");

// authorization for token in request header
const authorization = function(request, response, next) {
  const token = request.headers["authorization"]
    .match(/(?:"[^"]*"|^[^"]*$)/)[0] //grabbing the text that is within the quotations
    .replace(/"/g, ""); // removing the quotation marks from the token that was received in the request header
  jwt.verify(token, privatekey, function(err, authData) {
    if (err) {
      // authorization failed
      console.log("authorization failed");
    } else {
      // on authorization successful continue with the API call
      next();
    }
  });
};

// exporting the function to be used in other files
module.exports = authorization;
