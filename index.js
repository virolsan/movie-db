// muita paketteja
// - socket.io
//
// sublime text plugin: jshint ...


var express = require('express');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectID;
var Logger = require('mongodb').Logger;
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
//var contentDisposition = require('content-disposition')
var phantom = require('phantom');
var NodePDF = require('nodepdf');

var app = express(); // luodaan uusi express applikaatio
app.use(bodyParser.json()); // lisää requestin käsittelijä -middleware

app.use(serveStatic('client/', {'index': ['index.html', 'index.htm']})); // tarjoillaan client app
/*
app.use(serveStatic('pdf/', {'setHeaders': setHeaders})); // tarjoillaan pdf download
// Set header to force download
function setHeaders(res, path) {
	console.log('setHeaders');
  res.setHeader('Content-Disposition', contentDisposition(path))
}*/

mongoose.connect('mongodb://127.0.0.1/moviedb', function (err, db) {
	if (err){
		throw err;
	}
	init(db);
});

Logger.setLevel('debug');
//Logger.filter('class', ['Cursor']);

function init(db) {

	var Movie = mongoose.model('movies', new Schema({ 
		title: String, 
		year: Number, 
		actors: [{ name: String, _id: false }]
	}));

	app.get('/movies', function (req, res, next) { // next on seuraava middleware käsittelijä
	  	Movie.find(function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	});

	app.get('/search', function (req, res) {
	  	Movie.find({'title': req.query.title}, function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	});

	app.get('/movies/:id', function (req, res) {
	  	Movie.findOne({'_id': req.params.id}, function (err, result) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(result);
	  	});
	});

	app.post('/movies', function (req, res) {
		console.log('saving ' + req.body);
		var movie = new Movie(req.body);
		
		movie.save(function(err, data, next) {
			if (err) {
				next(err); // HTTP 500
				return;
			}

		  	res.status(201).send(data);
		});
	});

	app.get('/movies/:id/print', function(req, res) {
		console.log('Printing ' + req.params.id);
/*
		var pdf = new NodePDF('http://localhost:9000', 'pdf/foo.pdf');
		pdf.on('error', function(msg){
		    console.log(msg);
		});
		 
		pdf.on('done', function(pathToFile){
		    console.log(pathToFile);
		});

		// use default options 
		NodePDF.render('http://localhost:9000', 'pdf/foo.pdf', function(err, filePath){
			if (err) {
				next(err); // HTTP 500
				return;
			}

		    console.log('Printed to ' + filePath);
		    res.redirect(filePath);
		});
		res.redirect('/pdf/foo.pdf');
*/

		phantom.create(function(ph) { 
			return ph.createPage(function(page) { 
				page.set('viewportSize', { width: 1920, height: 1080 }, function (result) {
				    console.log("Viewport set to: " + result.width + "x" + result.height);
				});
				// We open phantomJS at the proper page. 
				return page.open("http://localhost:9000", function(status) { 
					return page.render('pdf/foo.pdf', function(result) {
						console.log(result);
						res.download('./pdf/foo.pdf', 'foo.pdf');
						return ph.exit();
					}); 
				}); 
			}); 
		});

	});


	app.delete('/movies/:id', function (req, res) {
		console.log('deleting ' + req.params.id);

		if (req.params.id) {
			Movie.remove({_id: req.params.id}, function(err, next) {
				if (err) {
					next(err); // HTTP 500
					return;
				}

			  	res.status(200).send();
			});
		}
	});

	// truncate movies
	app.delete('/movies', function (req, res) {
		console.log('truncating movies');

		Movie.remove({}, function(err, next) {
			if (err) {
				next(err); // HTTP 500
				return;
			}

		  	res.status(200).send();
		});
	});

	app.use(function (err, req, res, next) { // add express error handler (4 params convention)
		res.status(500).send('Internal server error');
	});
}

// asetetaan aplikaatio kuuntelemaan porttia 9000 ja
// tulostetaan viesti kun se on valmis vastaanottamaan kyselyitä
app.listen(9000, function () {
	console.log('Movie API listening port 9000');
});