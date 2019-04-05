const express = require('express')
const database = require('../config/database');
const router = express.Router();

router.get('/todaynotifs/:id', (request, response)=>{
    const userid = request.params.id
    console.log(userid);

    database.query('SELECT * FROM notifications WHERE notifications.userid = :id AND notifications.createddate >= NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC', 
    {replacements:{id:userid}, type: database.QueryTypes.SELECT})
    .then(results =>{
        response.send(results);
    })
})

router.get('/recentnotifs/:id', (request, response)=>{
    const userid = request.params.id;
    console.log(userid);
    database.query('SELECT * FROM notifications WHERE notifications.userid = :id AND notifications.createddate < NOW() - INTERVAL \'24 HOURS\' ORDER BY notifications.createddate DESC',
    {replacements:{id:userid}, type:database.QueryTypes.SELECT})
    .then(results=>{
        response.send(results);
    });
})

router.get('/likenotifs/:id', (request, response)=>{
    const likeid = request.params.id;
    console.log(likeid);
    database.query('SELECT users.firstname, users.lastname, likes.userid, likes.likeid, postcommentreply.activityid, postcommentreply.activitytype \
    FROM likes INNER JOIN postcommentreply ON likes.activityid = postcommentreply.activityid INNER JOIN users ON likes.userid = users.userid \
    WHERE likes.liketype = 1 AND likes.likeid = :id', {replacements: {id: likeid}, type: database.QueryTypes.SELECT})
    .then(results=>{
        response.send(results);
    })
})

router.get('/activitynotifs/:id', (request, response)=>{
    const activityid = request.params.id;
    console.log(activityid);
    database.query('SELECT users.firstname, users.lastname, users.userid, users.profileimage, postcommentreply.activityid, postcommentreply.activitytype, postcommentreply.activityreference \
    FROM postcommentreply INNER JOIN users ON users.userid = postcommentreply.userid WHERE postcommentreply.activityid = :id', 
    {replacements: {id: activityid}, type: database.QueryTypes.SELECT})
    .then(results =>{
      
        response.send(results);
    })
})

router.get('/userpic/:id', (request, response)=>{
    const userid = request.params.id;
    console.log(userid);
    database.query('SELECT users.profileimage FROM users WHERE users.userid = :id', {replacements:{id:userid}, type: database.QueryTypes.SELECT})
    .then(results =>{
      
        response.send(results);
    });
})

module.exports = router;