/*
 * server.js serves up the lab7_1.html and lab7_2.html files statically
 * Lab07 for CS336 Web Development
 * October 19, 2016
 *
 */

// Set up express to be able to be used
const express = require("express");
const app = express();

// Set up body-parser to use for the app.get("/hello") method below
const bodyParser = require("body-parser");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Set const variables
const HOST = "localhost";
const PORT = 3000;

// Be able to use the files in the public directory
app.use(express.static("public"));

// Default URL get method
app.get("/", function(req, res) {
	res.send("Hello Lab07! Created by Ethan Clark (elc3).");
});

// URL route to send JSON message to client
app.get("/hello", function(req, res) {
	res.send({"message" : "Hello, " + req.query.name + "!"});
});

// Show that the app is listening on PORT and HOST
app.listen(PORT, HOST, () => {
	console.log("Lab07 listening on " + HOST + ":" + PORT + "...");
});