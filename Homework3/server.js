/*
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/*
 * server.js serves up the necessary information for Homework3,
 * 		Repurposed from the Facebook React tutorial.
 * Ethan Clark (elc3)
 * Homework3 for CS 336
 * November 10, 2016
 */

// Set up the necessary requires to use in the server routes
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;
var password;

// Set const variables
const HOST = "localhost";
const PORT = 3000;

// Set up the use of the 'dist' directory and the bodyParser to parse JSON data
app.use('/', express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

/*************** The next two routes are for the React front end page **************/

// Load all the people from the MongoDB database and return to the client
app.get('/api/people', function(req, res) {
    db.collection("people").find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res.json(docs);
    });
});

// Add another person to the MongoDB
app.post('/api/people', function(req, res) {
    var newPerson = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        idnumber: req.body.idnumber,
        startdate: req.body.startdate,
    };
    db.collection("people").insertOne(newPerson, function(err, result) {
        assert.equal(err, null);
        res.json(result);
    });
});

/*********** The next four routes are all GETs for employee information **********/

// Write out all the employees when /people URL is found
app.get('/people', function(req, res) {
    console.log('Writing out employees to the web page!')
    db.collection("people").find({}).toArray(function(err, docs) {
        assert.equal(err, null);
        res.json(docs);
    })
    
});

// Write out the full record of the employee with the given ID if /person/:ID URL is found
app.get('/person/:ID', function(req, res) {
    var loginID = req.params.ID;
    db.collection("people").find().toArray(function(err, docs) {
        for (object of docs) {
            if (object["idnumber"] == loginID) {
                res.json(object);
            }
        }
    });
});

// Write out the first and last name of the employee with the given ID if /person/:ID/name URL is found
app.get('/person/:ID/name', function(req, res) {
    var loginID = req.params.ID;
    db.collection("people").find().toArray(function(err, docs) {
        for (object of docs) {
            if (object["idnumber"] == loginID) {
                var temp_name = object["firstname"] + " " + object["lastname"];
                res.json(temp_name);
            }
        }
    });
});

// Write out how many years the employee with the given ID has worked at the company if /person/:ID/years URL is found
app.get('/person/:ID/years', function(req, res) {
    var loginID = req.params.ID;
    db.collection("people").find().toArray(function(err, docs) {
        for (object of docs) {
            if (object["idnumber"] == loginID) {
                var years = getYears(object["startdate"]);
                res.json(years);
            }
        }
    });
});

/********* The next routes are POST, PUT, and DELETE for the server to handle **********/

// Get new Employee information from AJAX form data
app.post('/people', function(req, res) {

    // Create a newPerson variable
    var newPerson = {
        firstname: req.body.user_first_name,
        lastname: req.body.user_last_name,
        idnumber: req.body.user_id_number,
        startdate: req.body.user_start_date,
    };

    // Add the newPerson to the people collection in the Mongo Database
    db.collection("people").insertOne(newPerson, function(err, result) {
        assert.equal(err, null);
    });

    // Create a JSON object for the result data that is going to get sent back
    resultData = {"first" : req.body.user_first_name, "last" : req.body.user_last_name};

    // Send the JSON object result data back to the Web Page
    res.json(JSON.stringify(resultData));

});

// Get an Employee information record based on an ID Number from the user
app.post('/person/:ID', function(req, res) {

    // Get the ID Number entered by the user using req.body
    var loginID = req.body.id_number;

    // Find the person based on the sent ID number
    db.collection("people").find().toArray(function(err, docs) {
        for (object of docs) {
            if (object["idnumber"] == loginID) {
                resultData = {"first": object["firstname"], "last": object["lastname"], "ID": object["idnumber"], 
                                "years": getYears(object["startdate"])};
                res.json(JSON.stringify(resultData));
                return;
            }
        }
    });
});

// Use the HTML PUT method to update an Employee's information
app.put('/person/:ID', function(req, res) {

    var loginID = req.params.ID;
    db.collection("people").updateOne({idnumber: loginID}, { $set: {firstname: req.body.firstname, lastname: req.body.lastname,
            idnumber: req.body.idnumber, startdate: req.body.startdate}});

    res.json('Successfully updated employee with ID: ' + loginID);
});

// Delete a particular Person record from the employee_list data
app.delete('/person/:ID', function(req, res) {

    // Get the loginID from the URL request
    var loginID = req.params.ID;

    db.collection("people").deleteOne({idnumber: loginID});

    // Send a message back to the Web Page, saying the delete was successful
    res.json('Successfully removed employee with ID ' + loginID);

});

/********* The next route handles all bad URLs by serving up a 404 error ***********/

// Capture any wrong URL for this WebServer and serve up a 404 Not Found error
app.all('*', function(req, res) {
    console.log("Wrong URL or ID Number not found.")
    res.sendStatus(404);
});

/************* Utility methods **************/

// Show that the app is listening on PORT and HOST
app.listen(PORT, HOST, () => {
    console.log("Homework3 listening on " + HOST + ":" + PORT + "...");
});


// Connect to the MongoDB with a user and a password
MongoClient.connect('mongodb://cs336:' + password + '@ds147797.mlab.com:47797/cs336', function (err, dbConnection) {
	if (err) { throw err; }
	db = dbConnection;
});

// Function to calculate how long an employee has worked at the organization
var getYears = function(startDate) {
    var today = new Date();
    var birthDate = new Date(startDate);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}