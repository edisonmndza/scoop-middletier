const database = require('../config/database')
const express = require('express')
const userModel = database.import('../models/postcomment')

const router = express.Router()

router.post('/', (req, res) => {
    const {userid, activitytype, posttext, otheractivityid} =  req.body
    console.log(userid)
    userModel.create({
        userid: userid,
        activitytype: activitytype,
        posttext: posttext,
        otheractivityid: otheractivityid
    }).then( () => {
        res.send("Success")
    })
})

module.exports = router