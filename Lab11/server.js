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

/***** Provided to use through the React Facebook Tutorial *******/

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

// Added for Lab10; using MongoDB
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var db;
var password;

// Set const variables
const HOST = "localhost";
const PORT = 3000;

app.use('/', express.static(path.join(__dirname, 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Cache-Control', 'no-cache');
    next();
});

app.get('/api/comments', function(req, res) {
    db.collection("comments").find({}).toArray(function(err, docs) {
    	assert.equal(err, null);
    	res.json(docs);
    });
});

app.post('/api/comments', function(req, res) {
    var newComment = {
        id: Date.now(),
        author: req.body.author,
        text: req.body.text,
    };
    db.collection("comments").insertOne(newComment, function(err, result) {
        assert.equal(err, null);
        res.json(result);
    });
});

// Show that the app is listening on PORT and HOST
app.listen(PORT, HOST, () => {
    console.log("Lab11 listening on " + HOST + ":" + PORT + "...");
});

// Connect to the MongoDB
MongoClient.connect('mongodb://cs336:' + password + '@ds147797.mlab.com:47797/cs336', function (err, dbConnection) {
	if (err) { throw err; }
	db = dbConnection;
});