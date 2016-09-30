/*
 * Lab04 server.js allows for serving up of the doc1.html file using express
 * Ethan Clark (elc3)
 * September 28, 2016
 */

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.listen(3000, function() {
	console.log('Lab04 app listening on port 3000!')
})

app.use(express.static('public'));