const express = require('express')
const database = require('../config/database')
const sequelize = require('sequelize')
const userModel = database.import('../models/users')
const positionModel = database.import('../models/positions')
const divisionModel = database.import('../models/divisions')
const buildingModel = database.import('../models/buildings')
const userSocialModel = database.import('../models/usersocial')
const fs = require('fs')
const router = express.Router()

// Route for getting the intitial information when the user edits the profile
router.get("/getinitial/:userid", (request, response) => {
    // Gets the user id from app
    const userid = request.params.userid

    // Query that gets all the information needed
    database.query("SELECT * FROM scoop.users LEFT JOIN scoop.positions ON scoop.users.positionid = scoop.positions.positionid LEFT JOIN scoop.divisions ON scoop.users.divisionid = scoop.divisions.divisionid LEFT JOIN scoop.buildings ON scoop.users.buildingid = scoop.buildings.buildingid WHERE userid = :id", 
    {replacements: {id: userid}, type: database.QueryTypes.SELECT})
    .then (result => {
        // Gets the image path on the server, reads the file and encodes it to send back to app
        var imagePath = result[0].profileimage;
        var imageFile = fs.readFileSync(imagePath)
        var base64data = imageFile.toString('base64')
        result[0].profileimage = base64data;

        // Output array to concatenate json arrays
        var output = {}
        
        // Promise to get the social media info
        Promise.all([initialSocial(userid)]).then(socials => {
            
            // Concatenates the json array
            output = jsonConcat(output, result[0])
            output = jsonConcat(output, socials[0])

            // Sends the information back to the app
            response.send(output)
        })
    })
})

// Route for the position auto complete text view
router.get("/positionchanged/:position", (request, response) => {
    // gets the position text in the edit text
    const position = request.params.position
    
    // Query to get all the information needed
    database.query("SELECT * FROM scoop.positions WHERE positionname LIKE \'" + position + "%\' LIMIT 3", 
    {replacements: {position: position}, type: database.QueryTypes.SELECT})
    .then (result => {
        // Sends the info back to the app
        response.send(result);
    })
})

// Route for the building auto complete text view
router.get("/addresschanged/:building", (request, response) => {
    // gets the address text from the building edit text
    const address = request.params.building
    
    // Query to get all the information needed
    database.query("SELECT * FROM scoop.buildings WHERE address LIKE \'" + address + "%\' LIMIT 3",
    {replacements: {address: address}, type: database.QueryTypes.SELECT})
    .then (result => {
        // Sends the info back to the app
        response.send(result)
    })
})

// Route to get the division auto complete text view
router.get("/divisionchanged/:division", (request, response) => {
    // gets the division text from the division edit text
    const division = request.params.division;

    // Query to get all the information needed
    database.query("SELECT * FROM scoop.divisions WHERE division_en LIKE \'" + division + "%\' LIMIT 3",
    {type: database.QueryTypes.SELECT})
    .then (result => {
        // Sends the info back to app
        response.send(result)
    })
})

// Route that runs when the save button is pressed.
// Updates db with all changed information
router.put("/updatedatabase", (request, response) => {
    // Gets the data from all the edit texts from the app
    const {userid, firstname, lastname, position, division, building, linkedin, twitter, facebook, instagram, city, province, image} = request.body
    
    // variables for the ids
    var positionid, buildingid, divisionid;

    // buffer for the encoded image that is passed
    let buff = new Buffer(image, 'base64')
    
    // the image path for the photo inputted
    var newImagePath = "./pictures/profilepictures/" + userid + ".jpeg"

    // Creating the image file from the encoded string
    fs.writeFileSync(newImagePath, buff, function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    })
    
    // Promise for getting all the ids before updating the user object
    Promise.all([positionReturned(position), buildingReturned(building, city, province), divisionReturned(division)])
    .then(results => {
        // Assigning the ids to the variables
        positionid = results[0]
        buildingid = results[1]
        divisionid = results[2]

        // Putting all the data that is to be updated into one variable
        const updatedUserData = {
            firstname: firstname,
            lastname: lastname,
            positionid: positionid,
            divisionid: divisionid,
            buildingid: buildingid,
            profileimage: newImagePath,
            modifiedby: userid,
            modifieddate: sequelize.fn('NOW')
        }

        // Updating the user table with all the information provided
        userModel.update(updatedUserData, {where: {userid: userid}})
    })

    // Promise for inputting all the user's social medias into the user social table
    Promise.all([facebookReturned(userid, facebook), twitterReturned(userid, twitter), linkedinReturned(userid, linkedin), instagramReturned(userid, instagram)])
})

// Function to help concatenate the json array on initial fill
function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}

// Function to get all the user's social media info on initial fill
const initialSocial = (userid) => {
    // query to find the users social
    return userSocialModel.findAll({
        where: {
            userid: userid,
            activestatus: 1
        }
    }).then(result => {
        // Putting all the social media urls into the an array 
        var object = {facebook: null, instagram: null, linkedin: null, twitter: null}

        // For loop to go through all the users social medias
        for (var i = 0; i < result.length; i++) {
            var current = result[i]

            // Switch to assign the correct urls to the correct social media
            if (current.socialmediaid === 1) {
                object.facebook = current.url
            } else if (current.socialmediaid === 2) {
                object.instagram = current.url
            } else if (current.socialmediaid === 3) {
                object.linkedin = current.url
            } if (current.socialmediaid === 4) {
                object.twitter = current.url       
            }
        }
        // Returns object to the initial fill
        return object
    })
}

// Function to update the facebook status on the usersocial table
const facebookReturned = (userid, facebook) => {
    // Finding the users social media (facebook)
    return userSocialModel.findOne({
        where: {
            userid: userid,
            socialmediaid: 1
        }
    }).then(function(found) {
        // Changing the facebook url
        if (found && facebook !== "") {
            userSocialModel.update({url: facebook, activestatus: 1}, {where: {userid: userid, socialmediaid: 1}})
        } 
        // deleting the facebook url
        else if (found && facebook === "") {
            userSocialModel.update({activestatus: 0}, {where: {userid: userid, socialmediaid:1}})
        } 
        // inputting a new url
        else if (!found && facebook !== "") {
            userSocialModel.create({socialmediaid: 1, userid: userid, url: facebook, activestatus: 1})
        }
    })
}

const instagramReturned = (userid, instagram) => {
    return userSocialModel.findOne({
        where: {
            userid: userid,
            socialmediaid: 2
        }
    }).then(function(found) {
        if (found && instagram !== "") {
            userSocialModel.update({url: instagram, activestatus: 1}, {where: {userid: userid, socialmediaid: 2}})
        }

        else if (found && instagram === "") {
            userSocialModel.update({activestatus: 0}, {where: {userid: userid, socialmediaid: 2}})
        }

        else if (!found && instagram !== "") {
            userSocialModel.create({socialmediaid: 2, userid: userid, url: instagram, activestatus: 1})
        }

    })
}

// Function to update the twitter status on the usersocial table
const instagramReturned = (userid, instagram) => {
    // Finding the users social media (twitter)
    return userSocialModel.findOne({
        where: {
            userid: userid,
            socialmediaid: 2
        }
    }).then(function(found) {
        // Changing the twitter url
        if (found && instagram !== "") {
            userSocialModel.update({url: instagram, activestatus: 1}, {where: {userid: userid, socialmediaid: 2}})
        } 
        // Deleting the twitter url
        else if (found && instagram === "") {
            userSocialModel.update({activestatus: 0}, {where: {userid: userid, socialmediaid:2}})
        } 
        // Inputting a new url
        else if (!found && instagram !== "") {
            userSocialModel.create({socialmediaid: 2, userid: userid, url: instagram, activestatus: 1})
        }
    })
}


// Function to update the twitter status on the usersocial table
const twitterReturned = (userid, twitter) => {
    // Finding the users social media (twitter)
    return userSocialModel.findOne({
        where: {
            userid: userid,
            socialmediaid: 4
        }
    }).then(function(found) {
        // Changing the twitter url
        if (found && twitter !== "") {
            userSocialModel.update({url: twitter, activestatus: 1}, {where: {userid: userid, socialmediaid: 4}})
        } 
        // Deleting the twitter url
        else if (found && twitter === "") {
            userSocialModel.update({activestatus: 0}, {where: {userid: userid, socialmediaid:4}})
        } 
        // Inputting a new url
        else if (!found && twitter !== "") {
            userSocialModel.create({socialmediaid: 4, userid: userid, url: twitter, activestatus: 1})
        }
    })
}

// Function to update the linked in status on the usersocial table
const linkedinReturned = (userid, linkedin) => {
    // Finding the user social media (linkedin)
    return userSocialModel.findOne({
        where: {
            userid: userid,
            socialmediaid: 3
        }
    }).then(function(found) {
        // Changing the linked in url
        if (found && linkedin !== "") {
            userSocialModel.update({url: linkedin, activestatus: 1}, {where: {userid: userid, socialmediaid: 3}})
        } 
        // Deleting the url
        else if (found && linkedin === "") {
            userSocialModel.update({activestatus: 0}, {where: {userid: userid, socialmediaid:3}})
        } 
        // Inputting a new url
        else if (!found && linkedin !== "") {
            userSocialModel.create({socialmediaid: 3, userid: userid, url: linkedin, activestatus: 1})
        }
    })
}

// Function to get the position id from the position name inputted at edittext
const positionReturned = (position) => {
    let positionid
    if (position !== "") {
        return positionModel.findOne ({
            // Finding the position in the position table
            where: {
                positionname: position
            }
        }).then(doesPositionExists => {
            // Checking if the result is null
            // [1] if not null, the position exist in db then we grab the positionid.
            // [2] if null, the position doesn't exist and (a) we have to add it to db, then (b) look for it in the db, then (c) grab the positionid
            if (doesPositionExists !== null) {
                // [1] Position exists and grabbing the positionid here
                positionid = doesPositionExists.positionid;
                return positionid
            } else {
                // [2] Position doesn't exist and we have to add it.
                positionModel.create({
                    // [2](a) adding the position to the position table
                    positionname: position
                    
                }).then( newPosition => {
                    positionid = newPosition.positionid
                    return positionid
                })
            }
        })
    } else {
        positionid = null
        return positionid
    }
}

// Function to get the building id from the address inputted at edittext
const buildingReturned = (building, city, province) => {
    let buildingid
    if (building !== "") {
        // Finding the address in the buildings table
        return buildingModel.findOne({
            where: {
                address: building 
            }
        }).then( doesBuildingExist => {
            // Checking if the result is null
            // [1] if not null, the address exist in the db then we grab the divisionid.
            // [2] if null, the address doesn't exist and (a) we have to add it to the db, then (b) look for it in the db, then (c) grab the buildingid
            if (doesBuildingExist !== null) {
                // [1] address exist in the db and we grab the building id here
                buildingid = doesBuildingExist.buildingid;
                console.log(buildingid)
                console.log("buildingid found")
                return buildingid
            } else {
                // [2] address doesn't exist in db and we have to add it
                buildingModel.create({
                    // [2](a) adding it to the db
                    address: building,
                    city: city,
                    province: province
                }).then( newBuilding => {
                    buildingid = newBuilding.buildingid
                    console.log("building object created")
                    return buildingid
                })
            }
        })
    } else {
        buildingid = null;
        console.log("building not found")
        return buildingid
    }
}

// Function to get the division id from the division inputted at edittext
const divisionReturned = (division) => {
    let divisionid
    if (division !== "") {
        // Finding the division in the division table
        return divisionModel.findOne ({
            where: {
                division_en: division
            }
        }).then(doesDivisionExist => {
            // Checking if the result is null
            // [1] if not null, the division exist in db then we grab the divisionid.
            // [2] if null, the division doesn't exist and (a) we have to add it to db, then (b) look for it in the db, then (c) grab the divisionid
            if (doesDivisionExist !== null) {
                // [1] Division exists and grabbing the divisionid here
                divisionid = doesDivisionExist.divisionid
                return divisionid
            } else {
                // [2] Division doesn't exist and we have to add it.
                divisionModel.create({
                    // [2](a) adding the division to the division table
                    division_en: division
                }).then( newDivision => {
                    divisionid = newDivision.divisionid;
                    return divisionid
                })
            }
        })
    } else {
        divisionid = null
        return divisionid
    }
}

module.exports = router