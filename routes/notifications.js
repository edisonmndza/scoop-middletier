const fs = require('fs'); //instantiate file system
const express = require('express') //instantiate express
const database = require('../config/database'); //import database
const router = express.Router(); //create a router

/**
 * Description: used to get notifications within the last 24 hours
 */
router.get('/todaynotifs/:id', (request, response)=>{
    const userid = request.params.id //gets the user id passed in

    database.query('SELECT * FROM notifications LEFT JOIN (SELECT users.firstname AS activityfirstname, users.lastname AS activitylastname, users.userid AS activityuserid, \
        users.profileimage AS activityprofileimage, postcommentreply.activityid AS activityactivityid, postcommentreply.activitytype AS activityactivitytype, postcommentreply.activityreference AS activityactivityreference FROM \
        postcommentreply INNER JOIN users ON \
        users.userid = postcommentreply.userid WHERE postcommentreply.activestatus = 1) t1 ON notifications.activityid = t1.activityactivityid \
        LEFT JOIN (SELECT users.firstname AS likesfirstname, users.lastname AS likeslastname, users.profileimage AS likesprofileimage, likes.userid AS likesuserid,likes.liketype AS likesliketype, \
        likes.likeid AS likeslikeid, s1.activityid AS likesactivityid, s1.activitytype AS likesactivitytype, s1.activityreference AS likesactivityreference, s1.activitytype AS likesactivitytype\
        FROM likes INNER JOIN postcommentreply s1 ON likes.activityid = s1.activityid INNER JOIN users ON likes.userid = users.userid WHERE \
        likes.activestatus = 1 AND likes.liketype=1) t2 ON notifications.likeid = t2.likeslikeid WHERE notifications.userid = :id AND notifications.createddate >= NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC', 
    {replacements:{id:userid}, type: database.QueryTypes.SELECT})
    .then(results =>{

        response.send(results); //sends results back after select statement
    })
})
// Description of SELECT statement: Selects notifications from last 24 hours which is left joined on activity ids with a table made of the activities joined with the person who performed the activity \
//                                  which is then left joined on like ids with a table made of likes joined with activities they liked joined with the users who performed the like

/**
 * Description: used to get images from last 24 hours
 */
router.get('/todayimages/:id', (request, response)=>{
    const userid = request.params.id //gets the user id passed in

    database.query('SELECT t1.activityprofileimage, t2.likesprofileimage FROM notifications LEFT JOIN (SELECT users.profileimage AS activityprofileimage, postcommentreply.activityid AS activityactivityid FROM \
        postcommentreply INNER JOIN users ON \
        users.userid = postcommentreply.userid WHERE postcommentreply.activestatus = 1) t1 ON notifications.activityid = t1.activityactivityid \
        LEFT JOIN (SELECT users.profileimage AS likesprofileimage, likes.likeid AS likeslikeid \
        FROM likes INNER JOIN postcommentreply s1 ON likes.activityid = s1.activityid INNER JOIN users ON likes.userid = users.userid WHERE \
        likes.activestatus = 1 AND likes.liketype=1) t2 ON notifications.likeid = t2.likeslikeid WHERE notifications.userid = :id AND notifications.createddate >= NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC', 
    {replacements:{id:userid}, type: database.QueryTypes.SELECT})
    .then(results =>{
        for(i=0; i< results.length; i++){
            if(results[i].activityprofileimage != null){ //checks if activity profile image is not null
                var imagePath = results[i].activityprofileimage; //gets the image path of the activity profile image
                var imageFile = fs.readFileSync(imagePath) //reads the image path and stores the file into a variable
                var base64data = imageFile.toString('base64') //converts the image file to a string
                results[i].activityprofileimage = base64data; //saves it into the results activity profile image
            }else if(results[i].likesprofileimage != null){ //checks if likes profile image is not null
                var imagePath = results[i].likesprofileimage; //gets the image path of the likes profile image
                var imageFile = fs.readFileSync(imagePath) //reads the image path and stores the file into a variable
                var base64data = imageFile.toString('base64')  //converts the image file to a string
                results[i].likesprofileimage = base64data; //saves it in the results likes profile image
            }else{ //otherwise all the images are null
                console.log("images are all null") //logs accordingly 
            }
        }
        response.send(results); //sends results back after for loop
    })
})
// Description of SELECT statement: Selects images from last 24 hours which is left joined on activity ids with a table made of the activities joined with the person who performed the activity \
//                                  which is then left joined on like ids with a table made of likes joined with activities they liked joined with the users who performed the like


/**
 * Description: used to get notifications after 24 hours
 */
router.get('/recentnotifs/:id', (request, response)=>{
    const userid = request.params.id; //gets the user id passed in
   
    database.query('SELECT * FROM notifications LEFT JOIN (SELECT users.firstname AS activityfirstname, users.lastname AS activitylastname, users.userid AS activityuserid, \
        users.profileimage AS activityprofileimage, postcommentreply.activityid AS activityactivityid, postcommentreply.activitytype AS activityactivitytype, postcommentreply.activityreference AS activityactivityreference FROM \
        postcommentreply INNER JOIN users ON \
        users.userid = postcommentreply.userid WHERE postcommentreply.activestatus = 1) t1 ON notifications.activityid = t1.activityactivityid \
        LEFT JOIN (SELECT users.firstname AS likesfirstname, users.lastname AS likeslastname, users.profileimage AS likesprofileimage, likes.userid AS likesuserid,likes.liketype AS likesliketype, \
        likes.likeid AS likeslikeid, s1.activityid AS likesactivityid, s1.activitytype AS likesactivitytype, s1.activityreference AS likesactivityreference, s1.activitytype AS likesactivitytype\
        FROM likes INNER JOIN postcommentreply s1 ON likes.activityid = s1.activityid INNER JOIN users ON likes.userid = users.userid WHERE \
        likes.activestatus = 1 AND likes.liketype=1) t2 ON notifications.likeid = t2.likeslikeid  WHERE notifications.userid = :id AND notifications.createddate < NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC',
    {replacements:{id:userid}, type:database.QueryTypes.SELECT})
    .then(results=>{
        response.send(results); //sends results back after select statement
    });
})
// Description of SELECT statement: Selects notifications after 24 hours which is left joined on activity ids with a table made of the activities joined with the person who performed the activity \
//                                  which is then left joined on like ids with a table made of likes joined with activities they liked joined with the users who performed the like


/**
 * Description: used to get images after 24 hours
 */
router.get('/recentimages/:id', (request, response)=>{
    const userid = request.params.id; //gets the user id passed in

    database.query('SELECT t1.activityprofileimage, t2.likesprofileimage FROM notifications LEFT JOIN (SELECT users.profileimage AS activityprofileimage, postcommentreply.activityid AS activityactivityid FROM \
        postcommentreply INNER JOIN users ON \
        users.userid = postcommentreply.userid WHERE postcommentreply.activestatus = 1) t1 ON notifications.activityid = t1.activityactivityid \
        LEFT JOIN (SELECT users.profileimage AS likesprofileimage, likes.likeid AS likeslikeid \
        FROM likes INNER JOIN postcommentreply s1 ON likes.activityid = s1.activityid INNER JOIN users ON likes.userid = users.userid WHERE \
        likes.activestatus = 1 AND likes.liketype=1) t2 ON notifications.likeid = t2.likeslikeid  WHERE notifications.userid = :id AND notifications.createddate < NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC',
    {replacements:{id:userid}, type:database.QueryTypes.SELECT})
    .then(results=>{
        
        for(i=0; i< results.length; i++){
            if(results[i].activityprofileimage != null){ //checks if activity profile image is not null
                var imagePath = results[i].activityprofileimage; //gets the image path of the activity profile image
                var imageFile = fs.readFileSync(imagePath) //reads the image path and stores the file into a variable
                var base64data = imageFile.toString('base64') //converts the image file to a string
                results[i].activityprofileimage = base64data; //saves it into the results activity profile image
            }else if(results[i].likesprofileimage != null){ //checks if likes profile image is not null
                var imagePath = results[i].likesprofileimage; //gets the image path of the likes profile image
                var imageFile = fs.readFileSync(imagePath) //reads the image path and stores the file into a variable
                var base64data = imageFile.toString('base64')  //converts the image file to a string
                results[i].likesprofileimage = base64data; //saves it in the results likes profile image
            }else{ //otherwise all the images are null
                console.log("images are all null") //logs accordingly 
            }
        }
        response.send(results); //sends results back after for loop
    });
})
// Description of SELECT statement: Selects images after 24 hours which is left joined on activity ids with a table made of the activities joined with the person who performed the activity \
//                                  which is then left joined on like ids with a table made of likes joined with activities they liked joined with the users who performed the like


module.exports = router;