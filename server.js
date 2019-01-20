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

  console.log(req.body.name);
  console.log(req.body.email);

 
 // Convert our form input into JSON ready to store in Couchbase
  var jsonVersion = JSON.stringify(req.body);

 // Save it into Couchbase with keyname user
  bucket.upsert(req.body.name, jsonVersion, function (err, response){
    if (err) {
      console.log('Failed to save to Couchbase', err);
      return;
    } else {
      res.send('Saved to Couchbase!');
    }
  });
  
});
