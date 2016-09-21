/*
 * lab3.js implements exercises 3.1 and 3.2 for Lab3
 *
 * @author: Ethan Clark (elc3)
 * @version: fall2016
 * CS336 Web Development
 */

var express = require('express');
var app = express();

// Send Hello World message when the url/server is called
app.get('/', function (req, res) {
  res.send('Hello World!');
});

// Listen on port 3000
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

// Be able to serve up static files from the public directory
app.use(express.static('public'));