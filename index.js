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
  
// Register the user
app.use("/register", require('./routes/registration'));
