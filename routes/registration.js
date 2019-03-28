const database = require('../config/database')
const userModel = database.import('./models/users')
const crypto = require('crypto');
const router = express.Router();

var genRandomString = function(length){
    return crypto.randomBytes(Math.ceil(length/2)).toString('hex') // converts to hex format
    .slice(0, length);
}

var sha512 = function(password, salt) {
    var hash = crypto.createHmac('sha512', salt);
    hash.update(password);
    var value= hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
}

function saltHashPassword(userPassword){
    var salt = genRandomString(16); //creates 16 random characters
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

router.post("/", (request, response) => {
    const {firstname, lastname, email, password} = request.body
    
    // Encrypting the password
    passwordData = saltHashPassword(password)
    
    // Inserting the data into the database
    userModel.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        salt: passwordData.salt,
        passwordhash: passwordData.passwordHash 
    })

    response.send("123")
}); 

module.exports = router;