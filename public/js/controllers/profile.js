'use strict';

/* Controllers */
app.controller('ProfileCtrl', ['$scope', '$http', '$state', '$localStorage', 'UserService', 
              function($scope, $http, $state, $localStorage, UserService) {

	$scope.edituser = JSON.parse(JSON.stringify($scope.user));
	$scope.roleString = {1: "Admin", 2: "User Manager", 3: "Regular User"};
	
	$scope.updateProfile = function(){
	  	UserService.updateProfile($scope.webtoken, $scope.edituser).success(function(cb) {
	      if (cb.success == true)
	      {
	      	if ($("#notification_success").is(':hidden'))
            {
              $("#notification_success").fadeIn("slow").html("Successfully updated profile.").delay(2000).fadeOut('slow');
            }

	        $.extend(true, $scope.user, $scope.edituser);
	        $scope.$storage.user = angular.toJson($scope.user);
	      }else{
	      	$scope.edituser = JSON.parse(JSON.stringify($scope.user));

	        if ($("#notification").is(':hidden'))
            {
                $("#notification").fadeIn("slow").html("Failed to save profile.").delay(2000).fadeOut('slow');
            }
	      }
		});
	}

	$scope.updatePassword = function(){
    	if ($scope.password1 == "" || $scope.password1 != $scope.password2)
	    {
	      if ($("#notification").is(':hidden'))
	      {
	          $("#notification").fadeIn("slow").html("New password and confirm passwords don't match.").delay(2000).fadeOut('slow');
	      }
	      return;
	    }

		UserService.userAuthenticate({email: $scope.user.email, password: $scope.opassword}).success(function(data) {
			if (data.token)
			{
				UserService.updatePassword(data.token, $scope.password1).success(function(cb) {
					if ($("#notification_success").is(':hidden'))
					{
					$("#notification_success").fadeIn("slow").html("Successfully updated.").delay(2000).fadeOut('slow');
					}

					$scope.opassword = "";
					$scope.password1 = "";
					$scope.password2 = "";
				});
			}else{
				if ($("#notification").is(':hidden'))
				{
					$("#notification").fadeIn("slow").html("Old password incorrect.").delay(2000).fadeOut('slow');
				}
			}
		});
	}
}]);