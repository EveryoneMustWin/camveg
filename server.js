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

var cluster = new couchbase.Cluster('http://139.59.183.221:8091');
cluster.authenticate('computingfacts', 're7L6qJ+');
var bucket = cluster.openBucket('camveg');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));

//------------------------------------------------------------------------------------------------------------------------------

app.get('/', function (req, res) {

  console.log("GET /");
  res.render('index', {});
});

app.listen(3000, function () {
  console.log('Camveg app listening on port 3000!');
});

app.post('/newuser', function(req, res) {

  console.log("POST /newuser");
 
  // Convert our form input into JSON ready to store in Couchbase
  var jsonVersion = JSON.stringify(req.body);
  console.log("document to save is:");
  console.log(jsonVersion);

  // Save it into Couchbase with email as key
  bucket.upsert(req.body.email, jsonVersion, function (err, response){
    if (err) {
      console.log('Failed to save to Couchbase', err);
      return;
    } else {
      res.send('Saved to Couchbase!');
    }
  });
});

app.post('/user', function(req, res) {

  console.log("POST /user");

  console.log("looking in the bucket for:");
 
  console.log(req.body.email);

  bucket.get(req.body.email, function(err, response) {

    if (err) {
      console.log('Failed to get from Couchbase', err);
      return;
    } else {
      console.log(response);
      res.send(response);
    }
  });
});

app.post('/newplace', function(req, res) {

  console.log("POST /newplace");
 
  // Convert our form input into JSON ready to store in Couchbase
  var jsonVersion = JSON.stringify(req.body);
  console.log("document to save is:");
  console.log(jsonVersion);

  // Save it into Couchbase with email as key
  bucket.upsert(req.body.id, jsonVersion, function (err, response){
    if (err) {
      console.log('Failed to save to Couchbase', err);
      return;
    } else {
      res.send('Saved to Couchbase!');
    }
  });
});


app.post('/place', function(req, res) {

  console.log("POST /place");

  if (req.body.id == undefined) {
	console.log("undefined id:");
  	return;
  }

  console.log("looking in the bucket for:");
  console.log(req.body.id);

  bucket.get(req.body.id, function(err, response) {

    if (err) {
      console.log('Failed to get from Couchbase', err);
      res.send("{ 'error': 'error, no place with that id' }");
      return;
    } else {
      console.log(response);
      res.send(response);
    }
  });
});
