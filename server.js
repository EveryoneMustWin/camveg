const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var session = require('express-session');

const crypto = require('crypto');
const salt = "95T320Dne2kNfoDs";

// const mongo = require('mongodb');
// var MongoClient = mongo.MongoClient;
//var MongoClient = require('mongodb').MongoClient;

const couch = require('couchbase');
var CouchClient = couch.CouchClient;


app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({ secret: 'this-is-a-secret-token', cookie: { maxAge: 60000 }}));

//------------------------------------------------------------------------------------------------------------------------------

app.get('/', function (req, res) {

  console.log("GET /")
});

app.listen(3000, function () {
  console.log('Camveg app listening on port 3000!')
});