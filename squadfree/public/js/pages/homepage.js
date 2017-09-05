var app = angular.module('SquadFreeModel', ['ngRoute']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
app.controller('SquadFreeController', function($scope, $http) {
	jQuery("#contact-form").submit(function(){
		var formData = {
			name: $scope.name,
			email: $scope.email,
			subject: $scope.subject,
			message: $scope.message,
		};
		$http.post("/", formData)
		.success(function (response){
			$scope.ResultData = response;
			$scope.name = null;
			$scope.email = null;
			$scope.subject = null;
			$scope.message = null;
		});
		return false;
	});
});