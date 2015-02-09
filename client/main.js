angular.module('main', [])
	   .controller('MovieCtrl', ['$scope', '$http', function($scope, $http) {
	   		console.log('In MovieCtrl');
			$http.get('/movies')
			.success(function(data, status, headers, config) {
				console.log('Data: ' + data);
		    	$scope.movies = data;
		  	}).
		  	error(function(data, status, headers, config) {
				console.log('Error: ' + data);
		    	$scope.movies = {};
		  	});
		}]);