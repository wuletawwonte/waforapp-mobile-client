
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
	}).when('/notice', {
		templateUrl: './templates/notice.html',
		controller: 'noticeCtrl'
	}).when('/forums', {
		templateUrl: './templates/forums.html',
		controller: 'forumsCtrl'
	}).when('/askQuestion', {
		templateUrl: './templates/askQuestion.html',
		controller: 'askQuestionCtrl'
	}).when('/forumDetails', {
		templateUrl: './templates/forumDetails.html',
		controller: 'forumDetailsCtrl'
	}).when('/election', {
		templateUrl: './templates/election.html',
		controller: 'electionCtrl'
	}).otherwise({
		template: '404'
	})
});

app.service('userService', function($localStorage) {
	var id;
	this.setId = function(data) {
		id = data;
	}

	this.getId = function() {
		return id;
	}

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

	$scope.openNotice = function(nid) {
		userService.setId(nid);
		$location.path('/notice');
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

	$scope.openQuestion = function(fid) {
		userService.setId(fid);
		$location.path('/forumDetails');
	}	

});

app.controller('noticeCtrl', function($scope, $http, $location, userService) {
	$scope.user = userService.getUser();

	var noticeId = userService.getId();

	function getNoticeDetails() {
		$http({
			url: 'http://192.168.43.207/users/m_notice',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'notice_id='+noticeId
		}).then(function($response) {
			$scope.notice = $response.data.notice; 
			$scope.comments = $response.data.comments; 
		});
	}

	getNoticeDetails();

	$scope.comment = function() {
		var comment_content = $scope.comment_content;

		$http({
			url: 'http://192.168.43.207/users/m_comment',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'comment_content='+comment_content+"&nid="+noticeId+"&user_id="+$scope.user['user_id']
		}).then(function($response) {
			getNoticeDetails();
		});
	}

	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}

});


app.controller('askQuestionCtrl', function($scope, $http, $location, userService) {
	$scope.user = userService.getUser();

	$scope.postForum = function () {
		var forumQuestion = $scope.forum_question;

		$http({
			url: 'http://192.168.43.207/users/m_post_question',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'forum_question='+forumQuestion+"&user_id="+$scope.user['user_id']
		}).then(function($response) {
			$location.path('/forums');
		});
	}
	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}
});

app.controller('forumDetailsCtrl', function($scope, $http, $location, userService) {
	$scope.fid = userService.getId();
	$scope.user = userService.getUser();

	function getForumDetails() {
		$http({
			url: 'http://192.168.43.207/users/m_question_details',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'fid='+$scope.fid
		}).then(function($response) {
			$scope.forum = $response.data.forum; 
			$scope.answers = $response.data.answers; 
		});
	}

	getForumDetails();

	$scope.postAnswer = function() {
		var answer_content = $scope.answer_content;
		$http({
			url: 'http://192.168.43.207/users/m_answer_forum_question',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'fid='+$scope.fid+"&answer_content="+answer_content+"&user_id="+$scope.user['user_id']
		}).then(function($response) {
			getForumDetails();
		});		
	};

	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}
});


app.controller('electionCtrl', function($scope, $location, $http, userService) {
	$scope.user = userService.getUser();

	function get_ads() {
		$http({
			url: 'http://192.168.43.207/users/m_election',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'user_id='+$scope.user['user_id']
		}).then(function($response) {
			$scope.today = $response.data.today;
			$scope.election = $response.data.election;
			$scope.candidates = $response.data.candidates;
			$scope.is_candidate = $response.data.is_candidate;
			$scope.advertisements = $response.data.advertisements;
		});	
	}

	get_ads();

	$scope.sendCandidateRequest = function() {
		$http({
			url: 'http://192.168.43.207/users/m_request_candidate',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'user_id='+$scope.user['user_id']
		}).then(function($response) {
			$scope.message = $response.data.message;
		});				
	}

	$scope.cancelCandidateRequest = function() {
		$http({
			url: 'http://192.168.43.207/users/m_cancel_candidate_request',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'user_id='+$scope.user['user_id']
		}).then(function($response) {
			$scope.message = $response.data.message;
		});						
	}

	$scope.post_advertisement = function() {
		var ad_content = $scope.ad_content;
		$http({
			url: 'http://192.168.43.207/users/m_post_advertisement',
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: 'user_id='+$scope.user['user_id']+"&ad_content="+ad_content
		}).then(function($response) {
			$scope.message = $response.data.message;
			get_ads();
		});								
	}


	$scope.signout = function() {
		userService.usersignout();
		$location.path('/');
	}
});



























