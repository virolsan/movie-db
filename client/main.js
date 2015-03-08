'use strict';

(function(angular) {

	angular.module('main', ['ngRoute'])
	   .controller('MovieCtrl', ['$scope', '$routeParams', '$location', '$http', 
	   		function($scope, $routeParams, $location, $http) {
		   		console.log('In MovieCtrl');

				$scope.loadMovies = function() {
					console.log('loadMovies');

					$http.get('/api/movies').
						success(function(data, status, headers, config) {
							//console.log('Data: ' + data);
					    	$scope.movies = data;
					  	}).
					  	error(function(data, status, headers, config) {
							console.log('Error: ' + data);
					    	$scope.movies = {};
					  	});
				};
				
				$scope.addMovie = function() {
					console.log('addMovie ' + $scope.data);

					$http.post('/api/movies/', $scope.data).
						success(function(data, status, headers, config) {
					    	$scope.data = {};
					  	}).
					  	error(function(data, status, headers, config) {
							console.log('Error: ' + status);
					  	});
				};

				$scope.deleteMovie = function(movieId) {
					console.log('deleteMovie ' + movieId);

					$http.delete('/api/movies/' + movieId).
						success(function(data, status, headers, config) {
					    	$scope.loadMovies();
					  	}).
					  	error(function(data, status, headers, config) {
							console.log('Error: ' + status);
					  	});
				};

				$scope.printMovie = function(movieId) {
					console.log('printMovie ' + movieId);

					$http.get('/api/movies/' + movieId + '/print').
						success(function(data, status, headers, config) {
					    	// initiate file download
                    		window.open('/api/movies/' + movieId + '/print', '_self', '');
					  	}).
					  	error(function(data, status, headers, config) {
							console.log('Error: ' + status);
					  	});
				};

				$scope.$watch('data', function(newValue, oldValue) {
					$scope.loadMovies();
		        });
			}]);

}(angular));