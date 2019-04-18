const fs = require('fs');
const express = require('express') //instantiate express
const database = require('../config/database'); //import database
const router = express.Router(); //create a router
const authorization = require("../config/token-verification"); // importing token authorization function
const LikeModel = database.import('../models/likes');
const NotificationsModel = database.import('../models/notifications');

/**
 * Description: gets post for specified feed
 */
router.get('/posts/:feed/:userid',authorization,(request, response)=>{
    const feed = request.params.feed;
    const userid = request.params.userid;
    database.query('SELECT coalesce(scoop.postcomment.activityid, t1.duplicateactivityid, t2.likesactivityid) AS activityid, posttitle, posttext, activestatus, createddate, activitytype, scoop.postcomment.userid, scoop.postcomment.activityreference, postimagepath, likecount, liketype, commentcount, firstname, lastname FROM scoop.postcomment \
    LEFT JOIN (SELECT SUM(scoop.likes.liketype) AS likecount, scoop.likes.activityid AS duplicateactivityid FROM scoop.likes GROUP BY scoop.likes.activityid) t1 ON scoop.postcomment.activityid = t1.duplicateactivityid \
    LEFT JOIN (SELECT scoop.likes.liketype, scoop.likes.activityid AS likesactivityid FROM scoop.likes WHERE scoop.likes.userid = :id) t2 ON scoop.postcomment.activityid = t2.likesactivityid \
    LEFT JOIN (SELECT COUNT(*) AS commentcount, scoop.postcomment.activityreference AS activityreference FROM scoop.postcomment GROUP BY scoop.postcomment.activityreference) t3 ON scoop.postcomment.activityid = t3.activityreference \
    INNER JOIN (SELECT scoop.users.firstname AS firstname, scoop.users.lastname AS lastname, scoop.users.userid AS userid FROM scoop.users) t4 ON scoop.postcomment.userid = t4.userid \
    WHERE scoop.postcomment.activitytype = 1 AND scoop.postcomment.activestatus = 1 AND feed = :feed \
    ORDER BY scoop.postcomment.createddate DESC', 
    {replacements: {id:userid, feed: feed}, type: database.QueryTypes.SELECT})
    .then(results=>{
    
        response.send(results);
    })
})
// Description of SELECT statement: selects posts which are of specified feed type, active, and not the user's own posts, this is then joined with the number of likes on that post, then joined with 
//                                  the liketype on the post, which is joined with the number of comments on the post, which is then joined with the corresponding users who posted the post

/**
 * Description: gets post and user images for the specified feed
 */
router.get('/images/:feed/:userid', authorization, (request, response)=>{
    const feed = request.params.feed;
    const userid = request.params.userid; 

    database.query('SELECT scoop.postcomment.postimagepath AS postimagepath, scoop.users.profileimage AS profileimage FROM scoop.postcomment \
    INNER JOIN scoop.users ON scoop.postcomment.userid = scoop.users.userid \
    WHERE scoop.postcomment.activitytype = 1 AND scoop.postcomment.activestatus = 1 AND feed = :feed \
    ORDER BY scoop.postcomment.createddate DESC',
    {replacements: {id: userid, feed: feed}, type: database.QueryTypes.SELECT})
    .then(results=>{
        for(i=0; i<results.length; i++){
            console.log("Hello");
            if(results[i].postimagepath != null && results[i].postimagepath != ""){ //if there is a post image
                console.log("hello")
                var postImagePath = results[i].postimagepath; //gets the image path of the postimagepath
                var postImageFile = fs.readFileSync(postImagePath); //reads the image path and stores the file into a variable
                var postbase64data = postImageFile.toString('base64'); //converts the image file to a string
                results[i].postimagepath = postbase64data; //saves it into the results postimagepath

                var userImagePath = results[i].profileimage;
                var userImageFile = fs.readFileSync(userImagePath);
                var userbase64data = userImageFile.toString('base64');
                results[i].profileimage = userbase64data;
            }else{
                var userImagePath = results[i].profileimage;
                var userImageFile = fs.readFileSync(userImagePath);
                var userbase64data = userImageFile.toString('base64');
                results[i].profileimage = userbase64data;
            }
        }
        response.send(results);
    }).catch(err=>{
        console.log(err);
    })
})
//Description of SELECT statement: selects the post image path for posts and joins it with the users to get the user image

/**
 * Description: inserts likes into likes table and notifications table if liketype == 1
 */
router.post('/insertlikes', authorization, (request, response)=>{
    const {userid, activityid, posterid, liketype} = request.body;
    LikeModel.create({
        activityid: activityid,
        liketype: liketype,
        activestatus:1,
        userid:userid
    }).then(result =>{
        if(result.liketype == 1){
            NotificationsModel.create({
                userid: posterid,
                likeid:result.likeid,
                activestatus: 1
            }).then(()=>{
                response.send("SUCCESS");
            })
        }
    })
})

/**
 * Description: updates like to new liketype and inserts into notifications table if new liketype == 1
 */
router.put('/updatelikes', authorization, (request, response)=>{
    const{userid, activityid, liketype, posterid} = request.body;
    database.query("UPDATE scoop.likes SET liketype = :liketype WHERE scoop.likes.userid = :id AND scoop.likes.activityid = :activityid RETURNING scoop.likes.likeid", 
    {replacements: {liketype: liketype, id: userid, activityid: activityid}})
    .then((result)=>{
        const likeid = result[0][0].likeid;
        if(liketype==1){
            database.query("INSERT INTO scoop.notifications (userid,likeid, activestatus) VALUES (:id, :likeid, 1)"
            ,{replacements:{id:posterid, activityid:activityid, likeid: likeid}})
            .then(()=>{
                response.send("SUCCESS");
            })
        }
    })
})

module.exports = router;