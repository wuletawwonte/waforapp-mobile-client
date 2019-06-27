
var app = angular.module('waforapp', ['ngRoute']);

app.config(function($routeProvider) { 
	$routeProvider.when('/', {
		templateUrl: './templates/home.html',
		controller: 'homeCtrl'
	}).$routeProvider.when('/home', {
		templateUrl: './templates/home.html',
		controller: 'homeCtrl'
	}).otherwise({
		template: '404'
	})

});

app.controller('homeCtrl', function($scope, $location) {
	$scope.data = "Hellow There";
});
