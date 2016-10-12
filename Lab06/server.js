/*
 * server.js uses Express to implement HTTP methods and HTTP response codes
 * Created by: Ethan Clark (elc3)
 * Date: October 12, 2016
 * Lab06 for CS336 Web Development
 */

 /* Answers to the lab exercises can be found here */

/************ Exercise 6.1 **************/

/* Which Curl commands were used successfully?
 *
 * I was able to successfully use
 *		curl http://localhost:3000/request for the GET method
 *		curl --head http://localhost:3000/request for the HEAD method
 *		curl -X PUT http://localhost:3000/request -d '{"Ethan": 100}' -H 'Content-Type: application/json' for the PUT method
 *		curl -X POST http://localhost:3000/request -d '{"Ethan": 100}' -H 'Content-Type: application/json' for the POST method
 *		curl -X DELETE http://localhost:3000/request -d '{"Ethan": 100}' -H 'Content-Type: application/json' for the DELETE method
 *
 */

/* Identify the request methods that you can and can't test using the two tools listed. If a method
 * 		cannot be tested useing a particular tool, explain why not. Be sure to include the Curl commands
 *		you used (and saved) above.
 *
 * I was able to see the GET and the ALL methods using the browser. The GET method is the usual one that posts to the browser and the ALL served up a GONE error code
 *		for any unspecified routes. The browser cannot do any more unless an HTTP form is implemented because that would send and receive and delete actual data.
 * The answer above shows that I was able to get curl to work for GET, HEAD, PUT, POST, and DELETE. I am not sure how to use curl to check the ALL, unspecified routes.
 *
 */

/* What is the most appropriate HTTP response code for pages that aren't defined by an Express route?
 *
 * 404 - NOT FOUND is the most appropriate HTTP resposne code for pages that aren't defined.
 *
 */

 /************** Exercise 6.2 ************/

 /* What HTTP methods do forms support?
  *
  * Forms support the HTTP GET method and the HTTP POST method.
  *
  */

 /* How is the form data being passed back to the server and what is the exact syntactic form it takes?
  *
  * This script, server.js, receives the data as a list of 3 key/value items embodied in the HTTP request. We handle it using
  *		the 'name' attributes assigned with the three input types in index.html. JavaScript/Express uses a module called body-parser to
  *		parse the req.body information that got sent to the server.
  *
  */

// Set up the use of Express for this web server
var express = require('express');
var app = express();

// Set up the use of http-status-codes and body-parser for server.js to use
var http_status = require('http-status-codes');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Get access to the HTML files in the public directory
app.use(express.static('public'));

// Use the HTTP GET method 
app.get('/request', function(req, res) {
	res.send('Hello GET!');
});

// Use the HTTP HEAD method
app.head('/request', function(req, res) {
	res.send('Hello HEAD!');
});

// Use the HTTP PUT method
app.put('/request', function(req, res) {
	res.send('Hello PUT! ' + req.body.Ethan);
});

// Use the HTTP POST method
//		Updated to work for the HTML forms page for Exercise 6.2
app.post('/request', function(req, res) {
	res.send('Hello form, elc3!<br>Name: ' + req.body.user_name +
		'<br>Email: ' + req.body.user_mail + '<br>Posted message: ' + req.body.user_message);
});

// Use the HTTP DELETE method
app.delete('/request', function(req, res) {
	res.send('Hello DELETE! ' + req.body.Ethan);
});

// Get all the other incorrect URLs and send an (in)appropriate error response
app.all('*', function(req, res) {
	res.sendStatus(http_status.GONE);
});

// Show that the server is listening on port 3000
app.listen(3000, function () {
	console.log('Lab06 application listening on port 3000!');
});
