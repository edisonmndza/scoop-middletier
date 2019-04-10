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
    var hash = crypto.createHmac('sha512', salt); //passes in the type of sha2 and the randomly generated salt
    hash.update(password); //updates the hash with the password
    var value= hash.digest('hex'); //computes the hash and stores it in variable value
    return {//returns an object with salt and passwordHash
        salt: salt, 
        passwordHash: value
    };
}

function saltHashPassword(userPassword){
    var salt = genRandomString(16); //creates 16 random characters
    var passwordData = sha512(userPassword, salt); //gets passwordData from the sha512 function
    return passwordData;
}

function checkHashPassword(userPassword, salt){
    var passwordData = sha512(userPassword, salt); //gets passwordData from sha 512 function
    return passwordData;
}

router.post("/register", (request, response) => {
    const {firstname, lastname, email, password} = request.body
    var defaultImagePath = "./pictures/profilepictures/default.png"
    
    // Encrypting the password
    passwordData = saltHashPassword(password)
    
    // Inserting the data into the database
    userModel.create({
        firstname: firstname,
        lastname: lastname,
        email: email,
        salt: passwordData.salt,
        passwordhash: passwordData.passwordHash,
        profileimage: defaultImagePath,
        userstatus: 1
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

    //finds the email if exists in the user table
    userModel.findAll({
        attributes:['userid', 'passwordhash', 'salt'],
        where:{
            email: email
        }
    
    }).then(result => {
        salt = result[0].salt; //gets the salt from the result
        pw = result[0].passwordhash; //gets the password from the result
        userid = result[0].userid; //gets the user id from the result
        passwordData = checkHashPassword(password, salt);
        if(pw==passwordData.passwordHash){ //if password hash in database matches what was entered
            console.log(userid.toString());
            response.send(`Success ${userid.toString()}`); //sends a success message and user id
        }
        else{
            response.send("Incorrect Password");
        }
    
    }).catch(function(err){ //if there is no such email
        if(err){
            console.log(err);
            response.send("Invalid Email"); //sends back invalid email
        }
    });  
})

module.exports = router;