'use strict';

/* Controllers */

app.controller('SigninFormController', ['$scope', '$http', '$state', 'UserService',
                                function($scope, $http, $state, UserService) {
    $scope.user = {};
    $scope.authError = null;
    
    $scope.login = function() {
      $scope.authError = null;
      
      UserService.userAuthenticate($scope.user).success(function(data){
        if (data.success){
          $scope.$storage.webtoken = data.token;
          $scope.$storage.user = angular.toJson(data.user);
          $state.go("app.profile");
        }else{
          $scope.authError = "Wrong email or password.";
        }
      }).error(function(data){
        $scope.authError = "Wrong email or password.";
      });
    };
}]);