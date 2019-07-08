const database = require("../config/database");
const express = require("express");
const fs = require("fs");
const mkdirp = require("mkdirp");
const userModel = database.import("../models/postcomment");
const authorization = require("../config/token-verification");
const router = express.Router();

const savedPostModel = database.import("../models/savedposts");

/*===============================Merged from display-post.js================================*/

const LikeModel = database.import('../models/likes');
const NotificationsModel = database.import('../models/notifications');



router.post("/add-post", authorization, (req, res) => {
  const { userid, activitytype, posttitle, posttext, postimage } = req.body;
  var imagepath = "";
  if (postimage != "") {
    //check if directory exists already
    mkdirp("./pictures/postpicture/" + userid, function(err) {
      //if error, this means directory already exists, ignore
      console.log("post image directory already exists");
    });

    //use current time for unique name
    var date = new Date();
    var currTime = date.getTime();
    console.log(currTime);
    imagepath = "./pictures/postpicture/" + userid + "/" + currTime + ".jpg";

    // write the image into the filepath
    let buff = new Buffer(postimage, "base64");
    fs.writeFileSync(imagepath, buff, function(err) {
      if (err) {
      }
    });
  }

database.query('SELECT officialcertified FROM scoop.users WHERE userid = :id', 
  {replacements:{id: userid}, type: database.QueryTypes.SELECT})
  .then((result)=>{
    var feed;
    if(result[0].officialcertified=='yes'){
      feed = 'official'
    }else{
      feed = 'community'
    }
 //send the object to the postcomment table in the scoopdb database.
  //image path will be left blank ("") if no image was added to the post.
  userModel
    .create({
      userid: userid,
      activitytype: activitytype,
      posttitle: posttitle,
      posttext: posttext,
      postimagepath: imagepath,
      feed: feed,
    })
    .then(() => {
      res.send("Success");
    });
  })
 
});


/*===============================Merged from display-post.js================================*/


/**
 * Description: gets post for specified feed
 */
router.get('/display-post/:feed/:userid',authorization,(request, response)=>{
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
      console.log(results)
      response.send(results);
  })
})

/**
 * Description: gets post and user images for the specified feed
 */
router.get('/display-post-images/:feed/:userid', authorization, (request, response)=>{
  const feed = request.params.feed;
  const userid = request.params.userid; 
  console.log(feed)
  console.log(userid)
  database.query('SELECT scoop.postcomment.postimagepath AS postimagepath, scoop.users.profileimage AS profileimage FROM scoop.postcomment \
  INNER JOIN scoop.users ON scoop.postcomment.userid = scoop.users.userid \
  WHERE scoop.postcomment.activitytype = 1 AND scoop.postcomment.activestatus = 1 AND feed = :feed \
  ORDER BY scoop.postcomment.createddate DESC',
  {replacements: {id: userid, feed: feed}, type: database.QueryTypes.SELECT})
  .then(results=>{
      console.log(results)
      for(i=0; i<results.length; i++){
          console.log("Profile image path below:");
          console.log(results[i].profileimagepath);
          if(results[i].postimagepath != null && results[i].postimagepath != ""){ //if there is a post image
              console.log("There is a post image!")
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
      console.log("Number of posts in this feed: " + results.length)

      response.send(results);
  }).catch(err=>{
      console.log(err);
  })
})

//Description of SELECT statement: selects the post image path for posts and joins it with the users to get the user image

/**
 * Description: inserts likes into likes table and notifications table if liketype == 1
 */
router.post('/like-post', authorization, (request, response)=>{
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
router.put('/update-like-post', authorization, (request, response)=>{
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



/**
 * Description: Saves a post into the database given the respective activityid of the post and the userid of the user saving the post
 */
router.post("/save-post", authorization, (request, response) => {
  const {activityid, userid} = request.body;
  //send the object to the savedposts table in the scoopdb database.
  savedPostModel
    .create({
      activityid: activityid,
      userid: userid,
    })
    .then(() => {
      console.log("Valid save")
      response.send("Valid save");
    }).catch(function(err) {
      console.log(err.body);
      response.send("Invalid save - post already saved")
    });
  });


  
/**
 * Description: Gets a users saved posts activityid's from the savedposts table based on the given userid and returns the necessary feed post data 
 */
router.get('/display-saved-post/:userid',authorization,(request, response)=>{
  const userid = request.params.userid; 
  console.log(userid)
  database.query('SELECT coalesce(scoop.postcomment.activityid, t1.duplicateactivityid, t2.likesactivityid, t3.savedactivityid) AS activityid, posttitle, posttext, activestatus, createddate, activitytype, scoop.postcomment.userid, scoop.postcomment.activityreference, postimagepath, likecount, liketype, commentcount, firstname, lastname FROM scoop.postcomment \
  LEFT JOIN (SELECT SUM(scoop.likes.liketype) AS likecount, scoop.likes.activityid AS duplicateactivityid FROM scoop.likes GROUP BY scoop.likes.activityid) t1 ON scoop.postcomment.activityid = t1.duplicateactivityid \
  LEFT JOIN (SELECT scoop.likes.liketype, scoop.likes.activityid AS likesactivityid FROM scoop.likes WHERE scoop.likes.userid = :id) t2 ON scoop.postcomment.activityid = t2.likesactivityid \
  LEFT JOIN (SELECT scoop.savedposts.activityid AS savedactivityid, scoop.savedposts.userid AS userid, scoop.savedposts.createddate AS savedcreateddate FROM scoop.savedposts) t3 ON scoop.postcomment.activityid = t3.savedactivityid\
  LEFT JOIN (SELECT COUNT(*) AS commentcount, scoop.postcomment.activityreference AS activityreference FROM scoop.postcomment GROUP BY scoop.postcomment.activityreference) t4 ON scoop.postcomment.activityid = t4.activityreference \
  INNER JOIN (SELECT scoop.users.firstname AS firstname, scoop.users.lastname AS lastname, scoop.users.userid AS userid FROM scoop.users) t5 ON scoop.postcomment.userid = t5.userid \
  WHERE scoop.postcomment.activitytype = 1 AND scoop.postcomment.activestatus = 1 AND t3.userid = :id\
  ORDER BY t3.savedcreateddate DESC', 
  {replacements: {id:userid}, type: database.QueryTypes.SELECT})
  .then(results=>{
      console.log(results)
      response.send(results);
  })
})


  /**
   * Description: Gets the respective profile images and post images(if exists) of a users saved posts based on the given userid
   */

  router.get('/display-saved-post-images/:userid', authorization, (request, response)=>{
    const userid = request.params.userid; 
    console.log(userid)
    database.query('SELECT scoop.postcomment.postimagepath AS postimagepath, scoop.users.profileimage AS profileimage FROM scoop.postcomment \
    INNER JOIN scoop.users ON scoop.postcomment.userid = scoop.users.userid\
    INNER JOIN scoop.savedposts ON scoop.savedposts.activityid = scoop.postcomment.activityid\
    WHERE scoop.postcomment.activitytype = 1 AND scoop.postcomment.activestatus = 1 AND scoop.savedposts.userid = :id\
    ORDER BY scoop.savedposts.createddate DESC',
    {replacements: {id: userid}, type: database.QueryTypes.SELECT})
    .then(results=>{
        console.log(results)
        for(i=0; i<results.length; i++){
            console.log("Profile image path below:");
            console.log(results[i].profileimagepath);
            if(results[i].postimagepath != null && results[i].postimagepath != ""){ //if there is a post image
                console.log("There is a post image!")
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
        console.log("Number of saved posts: " + results.length)
  
        response.send(results);
    }).catch(err=>{
        console.log(err);
    })
  })

module.exports = router;
