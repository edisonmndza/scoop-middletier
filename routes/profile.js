const express = require('express')
const database = require('../config/database')
const router = express.Router()
const fs = require('fs')
const userModel = database.import('../models/users')
const userSocialModel = database.import('../models/usersocial')
const positionModel = database.import('../models/positions')
const divisionModel = database.import('../models/divisions')
const buildingModel = database.import('../models/buildings')

router.get("/initialfill/:userid", (request, response) => {
    const userid = request.params.userid
    var imagePath, imageFile, base64data, fullName, positionid, divisionid, buildingid, city, province, object;
    var output = {}

    userModel.findOne({
        where: {
            userid: userid
        }
    }).then(result => {
        imagePath = result.profileimage
        imageFile = fs.readFileSync(imagePath)
        base64data = imageFile.toString('base64')
        fullName = result.firstname + " " + result.lastname
        positionid = result.positionid
        divisionid = result.divisionid
        buildingid = result.buildingid
    }).then( () => {
        Promise.all([getPositionName(positionid), getDivisionName(divisionid), getBuilding(buildingid), initialSocial(userid)]).then(result => {
            city = result[2].city
            province = result[2].province
            console.log(result[3])
            object = {fullname: fullName, profileimage: base64data, position: result[0], division: result[1], city, province}
            output = jsonConcat(object, output)
            output = jsonConcat(result[3], output)
            response.send(output)
        })
    })
})

const getPositionName = (positionid) => {
    if (positionid !== null) {
        return positionModel.findOne({
            where: {
                positionid: positionid
            }
        }).then(result => {
            return result.positionname
        })
    } else {
        return null
    }
}

const getDivisionName = (divisionid) => {
    if (divisionid !== null) {
        return divisionModel.findOne({
            where: {
                divisionid: divisionid
            }
        }).then(result => {
            return result.division_en
        })
    } else {
        return null
    }
}

const getBuilding = (buildingid) => {
    if (buildingid !== null) {
        return buildingModel.findOne({
            where: {
                buildingid: buildingid
            }
        }).then(result => {
            return result
        })
    } else {
        return null
    }
}

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

function jsonConcat(o1, o2) {
    for (var key in o2) {
        o1[key] = o2[key];
    }
    return o1;
}
module.exports = router