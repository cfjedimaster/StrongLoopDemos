angular.module('starter.controllers', [])

.controller('rootCtrl', function($scope) {
	  
	$scope.$on('$ionicView.afterEnter', function(ev, data) { 
		ev.stopPropagation();
	});

})

.controller('loginCtrl', ['$scope', '$rootScope', 'userService', '$state', '$http',
	function($scope, $rootScope, userService, $state, $http) {
	
	$scope.user = {username:'raymondcamden@gmail.com',password:'password'};

	$scope.doLogin = function() {
		if($scope.user.username === '' || $scope.user.password === '') {
			return;
		}
		userService.login({email:$scope.user.username,password:$scope.user.password},function(res) {
			$rootScope.authToken = res.id; // don't really need to keep it
			$http.defaults.headers.common['Authorization'] = $rootScope.authToken;
			$state.go('root.Home');	
		},function(e) {
			//for right now - generic error
			alert('Login Failed');
		});
	};

}])

.controller('homeCtrl', ['$scope', '$rootScope', 'entryService', '$state', 
	function($scope, $rootScope, entryService, state) {
	
		$scope.$on('$ionicView.enter', function() {
			entryService.query({"filter[order]":"published desc"},function(res) {
				$scope.entries = res;
			}, function(e) {
				console.log('bad '+JSON.stringify(e));			
			});
		});		

}])
.controller('entryCtrl', ['$scope', '$rootScope', 'entryService', '$state', 
	function($scope, $rootScope, entryService, $state) {
	
	$scope.entry = {title:"",body:""};
	
	$scope.doSave = function() {
		var postedDate = new Date();

		var newEntry = new entryService();
		newEntry.title = $scope.entry.title;
		newEntry.body = $scope.entry.body;
		newEntry.released = true;
		newEntry.published = new Date();
		//not perfect...
		newEntry.slug = newEntry.title.replace(/ /g,'-');
		newEntry.$save();
		$state.go('root.Home');	

	}
		
}]);
