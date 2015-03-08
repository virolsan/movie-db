var phantom = require('phantom');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectID;

var Movie = mongoose.model('movies', new Schema({ 
	title: {type: String, required: true }, 
	year: Number, 
	actors: [{ name: String, _id: false }]
}));

var api = {
	list: function(req, res, next) {
		Movie.find(function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	},
	search: function (req, res, next) {
	  	Movie.find({'title': req.query.title}, function (err, results) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(results);
	  	});
	},
	get: function (req, res, next) {
	  	Movie.findOne({'_id': req.params.id}, function (err, result) {
	  		if (err) {
				next(err); // HTTP 500
				return;
			}

			res.send(result);
	  	});
	},
	save: function (req, res, next) {
		console.log('saving ' + req.body);
		var movie = new Movie(req.body);
		
		movie.save(function(err, data) {
			if (err) {
				next(err); // HTTP 500
				return;
			}

		  	res.status(201).send(data);
		});
	},
	delete: function (req, res, next) {
		console.log('deleting ' + req.params.id);

		if (req.params.id) {
			Movie.remove({_id: req.params.id}, function(err) {
				if (err) {
					next(err); // HTTP 500
					return;
				}

			  	res.status(200).send();
			});
		}
	},
	truncate: function (req, res, next) {
		console.log('truncating movies');

		Movie.remove({}, function(err) {
			if (err) {
				next(err); // HTTP 500
				return;
			}

		  	res.status(200).send();
		});
	},
	print: function(req, res) {
		console.log('Printing ' + req.params.id);

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
	}
}

exports.api = api;

module.exports.init = function(app) {

	app.get('/api/movies', api.list);

	app.get('/api/movies/search', api.search);

	app.get('/api/movies/:id', api.get);

	app.post('/api/movies', api.save);

	app.delete('/api/movies/:id', api.delete);

	app.get('/api/movies/:id/print', api.print);

	app.delete('/api/movies', api.truncate);

}
