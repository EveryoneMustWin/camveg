const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var session = require('express-session');

const crypto = require('crypto');
const salt = "95T320Dne2kNfoDs";

// const mongo = require('mongodb');
// var MongoClient = mongo.MongoClient;
//var MongoClient = require('mongodb').MongoClient;

const couchbase = require('couchbase');

var cluster = new couchbase.Cluster('couchbase://localhost');
var bucket = cluster.openBucket('camveg');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));

//------------------------------------------------------------------------------------------------------------------------------

app.get('/', function(req, res) {

  console.log("GET /")
  res.render('index', {});
});

app.post('/newuser', function(req, res) {

  console.log("POST /newuser")

  console.log(req.body.name);
  console.log(req.body.email);

	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify({ a: 1 }));

//  res.render('index', {});
});

app.listen(3000, function() {
  console.log('Camveg app listening on port 3000!')
});
