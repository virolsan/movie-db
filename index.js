// muita paketteja
// - socket.io
// - serve-static
//
// sublime text plugin: jshint ...


var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectId;
var Logger = require('mongodb').Logger;
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');

var app = express(); // luodaan uusi express applikaatio
app.use(bodyParser.json()); // lisää requestin käsittelijä -middleware

app.use(serveStatic('client/', {'index': ['index.html', 'index.htm']})); // tarjoillaan client app


MongoClient.connect('mongodb://127.0.0.1/moviedb', function (err, db) {
	if (err){
		throw err;
	}
	init(db);
});

//Logger.setLevel('debug');
//Logger.filter('class', ['Cursor']);

function init(db) {

	var collection = db.collection('movies'); // 'taulu'

	// endpoint kaikkien elokuvien hakemiseen
	app.get('/movies', function (req, res, next) { // next on seuraava middleware käsittelijä
	  	collection.find().toArray(function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	});

	app.get('/search', function (req, res) {
	  	collection.find({title: req.query.title}).toArray(function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	});

	app.get('/movies/:id', function (req, res) {
	  	collection.findOne({_id: ObjectId(req.params.id)}, {}, function (err, result) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(result);
	  	});
	});

	app.post('/movies', function (req, res) {
		var newMovie = req.body;
		
		collection.insert(newMovie, function(err, newMovies, next) {
			if (err) {
				next(err); // HTTP 500
				return;
			}

		  	res.status(201).send(newMovies);
		});
	});

	app.use(function (err, req, res, next) { // add express error handler (4 params convention)
		res.status(500).send('Internal server error');
	});
}

// asetetaan applikaatio kuuntelemaan porttia 9000 ja
// tulostetaan viesti kun se on valmis vastaanottamaan kyselyitä
app.listen(9000, function () {
	console.log('Movie API listening port 9000');
});