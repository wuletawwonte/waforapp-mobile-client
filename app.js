
var app = angular.module('waforapp', ['ngRoute']);

app.config(function($routeProvider) { 
	$routeProvider.when('/', {
		templateUrl: './templates/login.html',
		controller: 'loginCtrl'
	}).when('/home', {
		templateUrl: './templates/home.html',
		controller: 'homeCtrl'
	}).when('/comment', {
		templateUrl: './templates/comment.html',
		controller: 'commentCtrl'
	}).when('/forums', {
		templateUrl: './templates/forums.html',
		controller: 'forumsCtrl'
	}).when('/answer', {
		templateUrl: './templates/answer.html',
		controller: 'answerCtrl'
	}).otherwise({
		template: '404'
	})

});

app.controller('loginCtrl', function($scope, $location, $http) {
	$scope.login = function() {
		// var username = $scope.username;
		// var password = $scope.password;
		// $http({
		// 	url: 'http://192.168.43.207/users/m_login',
		// 	method: 'POST',
		// 	headers: {
		// 		'Content-Type': 'application/x-www-form-urlencoded'
		// 	},
		// 	data: 'username='+username+'&password='+password
		// }).then(function($response) {
		// 	// console.log($response.data);
		// 	if($response.data.status == 'loggedin'){
		// 		$location.path('/home');
		// 	} else {
		// 		$scope.errormessage = $response;
		// 	}
		// });
		$location.path('/home');
	}
});

app.controller('homeCtrl', function($scope, $location) {
	$scope.data = "Hellow There";
});


































