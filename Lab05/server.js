/*
 * Lab05 server.js allows for serving up of the index.html file using express
 * Ethan Clark (elc3)
 * October 5, 2016
 */

// Set up express to work with URL route requests
var express = require('express');
var app = express();

// Default message to send to the browser when this WebServer is requested
app.get('/', function (req, res) {
  res.send('Hello Lab05 for CS336! Created by EthanClark (elc3)');
});

// When this WebServer runs, output message to the console
app.listen(3000, function() {
console.log('Lab05 app listening on port 3000!')
})

// Be able to server up static files in the public directory
app.use(express.static('public'));