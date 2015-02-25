'use strict';

(function(angular) {

	angular.module('main', ['ngRoute'])
	   .controller('MovieCtrl', ['$scope', '$routeParams', '$location', '$http', 
	   		function($scope, $routeParams, $location, $http) {
		   		console.log('In MovieCtrl');

				$scope.loadMovies = function() {
					console.log('loadMovies');

					$http.get('/movies').
						success(function(data, status, headers, config) {
							//console.log('Data: ' + data);
					    	$scope.movies = data;
					  	}).
					  	error(function(data, status, headers, config) {
							console.log('Error: ' + data);
					    	$scope.movies = {};
					  	});
				};
				
				$scope.deleteMovie = function(movieId) {
					console.log('deleteMovie ' + movieId);

					$http.delete('/movies/' + movieId).
						success(function(data, status, headers, config) {
					    	$scope.loadMovies();
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