const database = require("../config/database");
const express = require("express");
const authorization = require("../config/token-verification");
// const nodemailer = require('nodemailer');

const router = express.Router();

const reportModel = database.import("../models/reporttable");


/**
 * Description:  
 */
router.post("/report-post", authorization, (request, response) => {
    const {activityId, userId, reportReason, reportBody} = request.body;
    //send the object to the savedposts table in the scoopdb database.
    reportModel
      .create({
        activityid: activityId,
        userid: userId,
        reason: reportReason,
        body: reportBody,
      })
      .then(() => {
        console.log("Post Reported");
        response.send("Success");
      }).catch(function(err) {
        console.log("Failed to report post. Post may have already been reported.")
        console.log(err.body);
        response.send("Fail");
      });
    });


/**
 * Description:  
 */
router.get('/send-email/:activityId/:posterId/:userId',authorization,(request, response)=>{
  const activityId = request.params.activityId; 
  const posterId = request.params.posterId; 
  const userId = request.params.userId; 
  database.query('SELECT activityid, scoop.reporttable.userid, reportedfirstname, reportedlastname, reason, body, createddate, senderfirstname, senderlastname FROM scoop.reporttable\
  INNER JOIN (SELECT scoop.users.firstname AS reportedfirstname, scoop.users.lastname AS reportedlastname, scoop.users.userid AS posterid FROM scoop.users) t0 ON t0.posterid = :posterid \
  INNER JOIN (SELECT scoop.users.firstname AS senderfirstname, scoop.users.lastname AS senderlastname, scoop.users.userid AS userid FROM scoop.users) t1 ON scoop.reporttable.userid = t1.userid \
  WHERE scoop.reporttable.activityid = :activityid AND scoop.reporttable.userid = :userid',
  {replacements: {activityid: activityId, posterid: posterId, userid: userId}, type: database.QueryTypes.SELECT})
  .then(results=>{
      console.log("retrieving report");
      console.log(results[0]);
      response.send(results[0]);

    // var transporter = nodemailer.createTransport(
    //     {
    //     host: "smtp-mail.outlook.com", // hostname
    //     secureConnection: false, // TLS requires secureConnection to be false
    //     port: 587, // port for secure SMTP
    //     auth: {
    //         user: "",
    //         pass: ""
    //     },
    //     tls: {
    //         ciphers:'SSLv3'
    //     },
    //     requireTLS:true,
    // });
    
    // let transporter = nodemailer.createTransport(
    //     {
    //     host: "smtp.gmail.com",
    //     secureConnection: false,
    //     port: 587,
    //     tls: {
    //         ciphers: 'SSLv3',
    //         rejectUnauthorized: false
    //     },
    //     requireTLS: true,
    //     requiresAuth: true,
    //     // domains: ["gmail.com", "googlemail.com"],
    //     auth: {
    //     user: "jack.ong587@gmail.com",
    //     pass: "Canada1!"
    //     }
    //     });


    // let mailOptions = {
    //     from: 'jack.ong587@gmail.com',
    //     to: 'edison.mendoza@canada.ca',
    //     subject: 'Sending Email using Node.js',
    //     html: '<h1>Welcome</h1><p>That was easy!</p>'
    // };
      
    //   transporter.sendMail(mailOptions, function(error, info){
    //     if (error) {
    //       console.log(error);
    //     } else {
    //       console.log('Email sent: ' + info.response);
    //       console.log('Message sent successfully!');
    //       console.log(nodemailer.getTestMessageUrl(info));
  
    //       // only needed when using pooled connections
    //       transporter.close();
    //     }


      });
  });





module.exports = router;
