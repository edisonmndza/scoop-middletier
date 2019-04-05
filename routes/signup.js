const express = require('express')
const database = require('../config/database')
const userModel = database.import('../models/users')
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

function checkHashPassword(userPassword, salt){
    var passwordData = sha512(userPassword, salt);
    return passwordData;
}

router.post("/register", (request, response) => {
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
    }).then( () => {
        userModel.findAll({
            attributes:['userid'],
        where:{
            email: email
                }
    }).then(results => {
        const userid = results[0].userid
        response.send(`Success ${userid.toString()}`)
        })
    })
 });
    

router.post("/login", (request, response)=>{
    const{email, password} = request.body

    userModel.findAll({
        attributes:['userid', 'passwordhash', 'salt'],
        where:{
            email: email
        }
    
    }).then(result => {
        salt = result[0].salt;
        pw = result[0].passwordhash;
        userid = result[0].userid;
        passwordData = checkHashPassword(password, salt);
        if(pw==passwordData.passwordHash){
            console.log(userid.toString());
            response.send(`Success ${userid.toString()}`);
        }
        else{
            response.send("Incorrect Password");
        }
    
    }).catch(function(err){
        if(err){
            console.log(err);
            response.send("Invalid Email");
        }
    });  
})

module.exports = router;