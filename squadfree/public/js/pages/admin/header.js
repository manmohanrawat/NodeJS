var app = angular.module('SquadFreeModel', ['ngRoute']).config(function($interpolateProvider){
    $interpolateProvider.startSymbol('{[{').endSymbol('}]}');
});
var base_url = jQuery("#baseURL").val();
app.controller('SquadFreeController', function($scope, $http, $interval) {
	notification();
	var updateClock = function() {
		notification();
    };
    $interval(updateClock, 5000);
	
	function notification(){
		var url = base_url+"/admin/notification";
		$http.get(url).success(function (response){
			$scope.TotalNotification = response.length;
			$scope.NotificarionMSG = "You have "+response.length+" notifications";
		});
	}
});

