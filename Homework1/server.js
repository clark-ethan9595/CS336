/* CS 336 Web Development
 * Homework 1 - Webserver to store a set of people records for an organization
 *  Ethan Clark (elc3)
 * October 2, 2016
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
//		it to number of years worked at the organization
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

// Require the 'express' module and prepare it for use
var express = require('express');
var app = express();

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
	console.log('Full record of the person with the given ID!');
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			res.json(employee_list[i]);
			return;
		}
	}
	res.sendStatus(404);
});

// Write out the first and last name of the employee with the given ID if /person/:ID/name URL is found
app.get('/person/:ID/name', function(req, res) {
	console.log('Full name of the person with the given ID!');
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			res.json(employee_list[i].first + " " + employee_list[i].last);
			return;
		}
	}
	res.sendStatus(404);
});

// Write out how many years the employee with the given ID has worked at the company if /person/:ID/years URL is found
app.get('/person/:ID/years', function(req, res) {
	console.log('How many years the individual worked with the organization!');
	var loginID = req.params.ID;
	for (i = 0; i < employee_list.length; i++) {
		if (loginID == employee_list[i].ID_Num) {
			var temp_years = employee_list[i].getYears();
			res.json(employee_list[i].first + " has worked here " + temp_years + " years!");
			return;
		}
	}
	res.sendStatus(404);
});

// Listen on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});