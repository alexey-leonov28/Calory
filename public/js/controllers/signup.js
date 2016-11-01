'use strict';

// signup controller
app.controller('SignupFormController', ['$scope', '$http', '$state', '$localStorage', 'UserService', 
                                function($scope, $http, $state, $localStorage, UserService) {
    $scope.user = {};
    $scope.authError = null;

    $scope.$storage = $localStorage.$default({});
    $scope.$storage.$reset({});

    $scope.signup = function() {
      $scope.authError = null;
      $scope.user.role = 3;
      
      if ($scope.user.password.length < 5)
      {
        $scope.authError = "Password length must be greater than 5.";
        return;
      }
      
      UserService.userRegister($scope.user).success(function(data){
        if (data.success){
          $scope.signin();
        }else{
          $scope.authError = "Duplicate username or email.";
        }
      });
    };

    $scope.signin = function() {
      $scope.authError = null;
      
      UserService.userAuthenticate($scope.user).success(function(data){
        if (data.success){
          $scope.$storage.webtoken = data.token;
          $scope.$storage.user = angular.toJson(data.user);
          $state.go("app.profile");
        }else{
          $scope.authError = "Wrong email or password.";
        }
      });
    };
  }])
 ;