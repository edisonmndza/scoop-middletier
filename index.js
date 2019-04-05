// Importing libraries
const express = require('express');
const bodyparser = require('body-parser')
const app = express();

// Using body-parser
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended: true}))

// Setting up the port for the server to listen on
app.listen(3000, () => {
    console.log("Server is up and listening on 3000..");
});

// Sample request response page
app.get("/", (req, res) => {
    res.send("Node.js Test Server")
});
<<<<<<< HEAD

app.use("/edituser", require('./routes/edituser'));
=======

app.use("/signup", require('./routes/signup.js'));

app.use("/notifications", require('./routes/notifications.js'));
>>>>>>> f1b90cb4b960a3b5ee4bf0ce35eda18c376c080a
