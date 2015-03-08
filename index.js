var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var serveStatic = require('serve-static');
var mongoose = require('mongoose');
//var contentDisposition = require('content-disposition')

var movieDB = require('./movie-db');

var app = module.exports = express(); // luodaan uusi express applikaatio

//require('express-debug')(app, {/* settings */});

app.use(bodyParser.json()); // lisää requestin käsittelijä -middleware
app.use(serveStatic('client/', {'index': ['index.html', 'index.htm']})); // tarjoillaan client app
/*
app.use(serveStatic('pdf/', {'setHeaders': setHeaders})); // tarjoillaan pdf download
// Set header to force download
function setHeaders(res, path) {
	console.log('setHeaders');
  res.setHeader('Content-Disposition', contentDisposition(path))
}*/

/* istanbul ignore next */
if (!module.parent) {
  app.use(logger('dev'));
}

mongoose.connect('mongodb://127.0.0.1/moviedb', function (err, db) {
	if (err){
		throw err;
	}
	movieDB.init(app);
});

app.use(function (err, req, res, next) { // add express error handler (4 params convention)
	res.status(500).send('Internal server error');
});

// asetetaan aplikaatio kuuntelemaan porttia 9000 ja
// tulostetaan viesti kun se on valmis vastaanottamaan kyselyitä
app.listen(9000, function () {
	console.log('Movie API listening port 9000');
});