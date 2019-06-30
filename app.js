
var app = angular.module('waforapp', ['ngRoute', 'ngStorage']);

app.config(function($routeProvider) { 
	$routeProvider.when('/', {
		resolve: {
			check: function($localStorage, $location) {
				if($localStorage.user) {
					$location.path('/home');
				}
			}
		},
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

app.service('userService', function($http, $localStorage) {
	this.usersignout = function() {
		delete $localStorage.user;
	}
	this.setUser = function (data) {
		$localStorage.user = data;
	}
	this.getUser = function() {
		return $localStorage.user;
	}
});

app.controller('loginCtrl', function($scope, $location, $http, userService) {
	$scope.login = function() {
		var username = $scope.username;
		var password = $scope.password;
		$http({
			url: 'http://192.168.43.207/users/m_login',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'username='+username+'&password='+password
		}).then(function($response) {
			if($response.data.status == 'loggedin'){
				userService.setUser($response.data);
				$location.path('/home');
			} else {
				$scope.errormessage = "Username or password not Correct";
			}
		});
	}
});

app.controller('homeCtrl', function($scope, $http, $location, userService) {
	$scope.user = userService.getUser();
	$http({
		url: 'http://192.168.43.207/users/m_notices',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then(function($response) {
		$scope.notices = $response.data;
	});
	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}
});

app.controller('forumsCtrl', function($scope, $http, $location, userService) {
	$scope.user = userService.getUser();
	$http({
		url: 'http://192.168.43.207/users/m_forums',
		method: 'POST',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then(function($response) {
		$scope.forums = $response.data;
	});	
	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}	
});


































