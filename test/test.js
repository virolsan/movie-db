var should = require('should'); 
var assert = require('assert');
var request = require('supertest');  
var mongoose = require('mongoose');
 
describe('Routing', function() {
  var url = 'http://localhost:9000';

  before(function(done) {
    mongoose.connect('mongodb://127.0.0.1/testdb');							
    done();
  });

  describe('MovieDB', function() {
    it('should list an Array', function(done) {
	    request(url)
			.get('/api/movies')
			.send()
			.expect(200) //Status code
		    .expect('Content-Type', /json/)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				res.body.should.be.an.Array;
				done();
			});
    });

    it('should store new movie', function(done){
		var movie = {
			title: 'New Movie',
			year: '2015'
		};
		request(url)
			.post('/api/movies')
			.send(movie)
			.expect(201) //Status code
			.expect('Content-Type', /json/)
			.end(function(err,res) {
				if (err) {
					throw err;
				}
				
				res.body.should.have.property('_id');
		        res.body.title.should.equal('New Movie');
		        res.body.year.should.equal(2015);
				done();
			});
	});

    it('should validate input on save', function(done) {
	    request(url)
			.post('/api/movies')
			.send({foo: 123})
			.expect(500) //Status code
			.end(function(err,res) {
				if (err) {
					throw err;
				}

				done();
			});
    });

  });
});