const express = require('express')
const database = require('../config/database')
const userModel = database.import('../models/users')
const positionModel = database.import('../models/positions')
const divisionModel = database.import('../models/divisions')
const buildingModel = database.import('../models/buildings')

const router = express.Router()

var returnString = "";

router.get("/getinitial/:userid", (request, response) => {
    const userid = request.params.userid
    console.log(userid)
    database.query("SELECT * FROM scoop.users LEFT JOIN scoop.positions ON scoop.users.positionid = scoop.positions.positionid LEFT JOIN scoop.divisions ON scoop.users.divisionid = scoop.divisions.divisionid LEFT JOIN scoop.buildings ON scoop.users.buildingid = scoop.buildings.buildingid WHERE userid = :id", 
    {replacements: {id: userid}, type: database.QueryTypes.SELECT})
    .then (result => {
        response.send(result[0]);
    })
})

router.get("/positionchanged/:position", (request, response) => {
    const position = request.params.position
    console.log(position)
    database.query("SELECT * FROM scoop.positions WHERE positionname LIKE \'" + position + "%\' LIMIT 3", 
    {replacements: {position: position}, type: database.QueryTypes.SELECT})
    .then (result => {
        response.send(result);
    })
})

router.get("/addresschanged/:building", (request, response) => {
    const address = request.params.building
    console.log(address)
    database.query("SELECT * FROM scoop.buildings WHERE address LIKE \'" + address + "%\' LIMIT 3",
    {replacements: {address: address}, type: database.QueryTypes.SELECT})
    .then (result => {
        response.send(result)
    })
})

router.get("/divisionchanged/:division", (request, response) => {
    const division = request.params.division;
    database.query("SELECT * FROM scoop.divisions WHERE division_en LIKE \'" + division + "%\' LIMIT 3",
    {type: database.QueryTypes.SELECT})
    .then (result => {
        response.send(result)
    })
})

router.put("/updatedatabase", (request, response) => {
    const {userid, firstname, lastname, position, division, building, linkedin, twitter, facebook, city, province} = request.body
    var positionid, buildingid, divisionid;
    
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
            } else {
                // [2] Position doesn't exist and we have to add it.
                positionModel.create({
                    // [2](a) adding the position to the position table
                    positionname: position
                }).then( newPosition => {
                    positionid = newPosition.positionid
                    console.log(positionid);   
                })
            }
        })
    } else {
        positionid = null
    }

    if (division !== "") {
        // Finding the division in the division table
        divisionModel.findOne ({
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
            } else {
                // [2] Division doesn't exist and we have to add it.
                divisionModel.create({
                    // [2](a) adding the division to the division table
                    division_en: division
                }).then( newDivision => {
                    divisionid = newDivision.divisionid;
                })
            }
        })
    } else {
        divisionid = null
    }

    if (building !== "") {
        // Finding the address in the buildings table
        buildingModel.findOne({
            where: {
                address: building 
            }
        }).then( doesBuildingExist => {
            // Checking if the result is null
            // [1] if not null, the address exist in the db then we grab the divisionid.
            // [2] if null, the address doesn't exist and (a) we have to add it to the db, then (b) look for it in the db, then (c) grab the buildingid
            if (doesBuildingExist !== null) {
                // [1] address exist in the db and we grab the building id here
                address = doesBuildingExist.buildingid
            } else {
                // [2] address doesn't exist in db and we have to add it
                buildingModel.create({
                    // [2](a) adding it to the db
                    address: building,
                    city: city,
                    province: province
                }).then( newBuilding => {
                    buildingid = newBuilding.buildingid
                })
            }
        })
    } else {
        building = null;
    }

    userModel.findOne ({
        userid: userid
    }).then( result => {
        result.updateAttributes({
            firstname: firstname,
            lastname: lastname,
            positionid: positionid,
            divisionid: divisionid,
            buildingid: buildingid,
            
            
            
        })
    })
})

module.exports = router