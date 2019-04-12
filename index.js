// Importing libraries
const express = require("express");
const bodyparser = require("body-parser");
const jwt = require("jsonwebtoken");

express.bodyparser;
const app = express();

// Using body-parser
app.use(bodyparser.json({ limit: "50mb" }));
app.use(bodyparser.urlencoded({ limit: "50mb", extended: true }));

// Setting up the port for the server to listen on
app.listen(3000, () => {
  console.log("Server is up and listening on 3000..");
});

// Sample request response page
app.get("/", (req, res) => {
  res.send("Node.js Test Server");
});

// Register the user
app.use("/signup", require("./routes/signup"));

// Add a post
app.use("/add-post", require("./routes/add-post"));

// Add a comment
app.use("/add-comment", require("./routes/add-comment"));

app.use("/edituser", require("./routes/edituser"));

app.use("/notifications", require('./routes/notifications.js'));

app.use("/profile", require('./routes/profile'))
