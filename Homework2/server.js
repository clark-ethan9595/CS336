/* CS 336 Web Development
 * Homework 2 - Webserver to store a set of people records for an organization
 * 		Extended from Homework1 for this class.
 *
 * Ethan Clark (elc3)
 * October 24, 2016
 */

// Create a Person object to store a person's first and last names, ID number, and date
//		they started working with an organization
function Person(first, last, ID_Num, startDate) {
	this.first = first;
	this.last = last;
	this.ID_Num = ID_Num;
	this.startDate = startDate;
}

// Declare a getYears method to take a Person's startDate and convert
//		it to number of years worked at the organization,
// 		taken from Naveen Jose's code calculating the same thing
Person.prototype.getYears = function() {
	var today = new Date();
	var birthDate = new Date(this.startDate);
	var age = today.getFullYear() - birthDate.getFullYear();
	var m = today.getMonth() - birthDate.getMonth();
	if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
		age--;
	}
	return age;
}

// Declare four Person variables to store in a list for the webserver to access
var Person1 = new Person("Ethan", "Clark", "100", "1999/09/05");
var Person2 = new Person("Mitch", "Stark", "101", "2000/10/12");
var Person3 = new Person("Mark", "Davis", "102", "1994/11/02");
var Person4 = new Person("Russ", "Clousing", "103", "1990/01/20");

// Declare the employee list and push all four Person variables to it
var employee_list = [];
employee_list.push(Person1);
employee_list.push(Person2);
employee_list.push(Person3);
employee_list.push(Person4);

/***********************************************************************************************************/

// Now begin the work of the server

// Require the 'express' module and prepare it for use
var express = require('express');
var app = express();

// Set up the use of http-status-codes and body-parser for server.js to use
var http_status = require('http-status-codes');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get access to the files in the public directory
app.use(express.static('public'));

// Send a default message to the browser when the default URL is called
app.get('/', function (req, res) {
  res.send("Hello, welcome to our webserver that holds our company's employees' information!");
});

// Write out all the employees to the browser when /people URL is found
app.get('/people', function(req, res) {
	console.log('Writing out employees to the web page!')
	res.json(employee_list)
});

// Write out the full record of the employee with the given ID if /person/:ID URL is found
app.get('/person/:ID', function(req, res) {
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			res.json(employee_list[i]);
			console.log('Full record of the person with the given ID!');
			return;
		}
	}
	res.sendStatus(404);
});

// Write out the first and last name of the employee with the given ID if /person/:ID/name URL is found
app.get('/person/:ID/name', function(req, res) {
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			res.json(employee_list[i].first + " " + employee_list[i].last);
			console.log('Full name of the person with the given ID!');
			return;
		}
	}
	res.sendStatus(404);
});

// Write out how many years the employee with the given ID has worked at the company if /person/:ID/years URL is found
app.get('/person/:ID/years', function(req, res) {
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			var temp_years = employee_list[i].getYears();
			res.json(temp_years);
			console.log('How many years the individual worked with the organization!');
			return;
		}
	}
	res.sendStatus(404);
});

// Get new Employee information from AJAX form data
app.post('/people', function(req, res) {

	// Get the necessary information from the AJAX request data using req.body
	var first_name = req.body.user_first_name;
	var last_name = req.body.user_last_name;
	var idnumber = req.body.user_id_number;
	var newStartDate = req.body.user_start_date;

	// Create a new Person type with the added information
	var new_Person = new Person(first_name, last_name, idnumber, newStartDate);

	// Test that the new Person was created properly
	console.log(new_Person);

	// Add the employee to the employee_list
	employee_list.push(new_Person);

	// Create a JSON object for the result data that is going to get sent back
	resultData = {"first" : req.body.user_first_name, "last" : req.body.user_last_name};

	// Send the JSON object result data back to the Web Page
	res.json(JSON.stringify(resultData));

});

// Get an Employee information record based on an ID Number from the user
app.post('/person/:ID', function(req, res) {

	// Get the ID Number entered by the user using req.body
	var loginID = req.body.id_number;

	// Iterate through the list until the correct Employee is found
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			resultData = {"first": employee_list[i].first, "last": employee_list[i].last, "ID": employee_list[i].ID_Num,
							"years": employee_list[i].getYears()};
			res.json(JSON.stringify(resultData));
			return;
		}
	}

	// If there is no Employee with the given ID, return a 404 Not Found error
	res.sendStatus(404);
});

// Use the HTML PUT method to update an Employee's information
app.put('/person/:ID', function(req, res) {

	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			employee_list[i].first = req.body.first;
			employee_list[i].last = req.body.last;
			employee_list[i].ID_Num = req.body.id_num;
			employee_list[i].startDate = req.body.startDate;
			res.send('Thank you for updating employee with ID number ' + req.params.ID);
		}
	}
});

// Delete a particular Person record from the employee_list data
app.delete('/person/:ID', function(req, res) {

	// Get the loginID from the URL request
	var loginID = req.params.ID;

	// Let the console know the searching has begun...
	console.log("Beginning search for person with ID number " + loginID);

	// Find the index of the particular employee in the employee_list data
	var list_index = 0;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			break;
		}
		else {
			list_index++;
		}
	}

	// Let the console know the searching is done...
	console.log("Done searching...");

	// If the ID cannot be found in the employee_list data
	//		return a 404 not found error
	if (list_index == employee_list.length) {
		res.sendStatus(404);
	}

	// Else splice (remove) the Person from the employee_list data
	else {
		employee_list.splice(list_index, 1);
	}

	// Send a message back to the Web Page, saying the delete was successful
	res.json('Successfully removed employee with ID ' + loginID);

});

// Capture any wrong URL for this WebServer and serve up a 404 Not Found error
app.all('*', function(req, res) {
	console.log("Wrong URL or ID Number not found.")
	res.sendStatus(404);
});

// Listen on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});