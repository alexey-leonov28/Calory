/* Controllers */
app.controller('userListCtrl', ['$scope', '$http', '$state', '$localStorage', 'UserService', 
              function($scope, $http, $state, $localStorage, UserService) {

    $scope.users = [];
    $scope.roleString = {1: "Admin", 2: "User Manager", 3: "Regular User"};

    if ($scope.user.role == 3)
    {
      $state.go("app.profile");
    }
    
    UserService.getUserList($scope.webtoken).success(function(dt) {
      if (dt.users)
      {
        $scope.users = dt.users;

        $scope.$watch('users', function() {
            $('.footable').trigger('footable_redraw');
        });
      }
    });

    $scope.activateUser = function(id)
    {
      for (var i = 0; i < $scope.users.length; i ++)
      {
        if ($scope.users[i]._id == id)
        {
          if ($scope.users[i].status == false)
            $scope.users[i].status = true;
          else
            $scope.users[i].status = false;

          UserService.updateProfileByID($scope.webtoken, $scope.users[i]).success(function(cb) {
            if (cb.success){
              if ($scope.users[i].status == true)
              {
                $("#notification_success").fadeIn("slow").html('User activated').delay(1000).fadeOut('slow');
              }else{
                $("#notification").fadeIn("slow").html('User deactivated').delay(1000).fadeOut('slow');
              }
            }
          });

          break;
        }
      }
    }

    $scope.removeUser = function(id)
    {
      if (confirm("Do you really want to remove the user?"))
      {
        for (var i = 0; i < $scope.users.length; i ++)
        {
          if ($scope.users[i]._id == id)
          {
            UserService.deleteUserByID($scope.webtoken, id).success(function(cb) {
              if (cb.success == true)
              {
                $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
                delete $scope.users.splice(i, 1);

                $scope.$watch('users', function() {
                    $('.footable').trigger('footable_redraw');
                });
              }else{
                $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
              }
            });

            break;
          }
        }
      }
    }

    $scope.editUser = function(id)
    {
      $state.go("app.edituser", {id: id});
    }

    $scope.editable = function(id, role){
      if ($scope.user._id == id || role == 1)
        return false;
      else 
        return true;
    }
}]);


app.controller('userEditCtrl', ['$stateParams', '$scope', '$http', '$state', '$localStorage', 'UserService', 
              function($stateParams, $scope, $http, $state, $localStorage, UserService) {
  $scope.edituser = {role: 3};
  $scope.isEdit = false;
  $scope.roleString = {1: "Admin", 2: "User Manager", 3: "Regular User"};
  $scope.password1 = "";
  $scope.password2 = "";

  if ($scope.user.role == 3)
  {
    $state.go("app.profile");
  }

  if ($stateParams.id !== ""){
    $scope.isEdit = true;

    UserService.getUserInfoById($scope.webtoken, $stateParams.id).success(function(cb) {
      if (cb.success == true)
      {
        $scope.edituser = cb.user;
      }
    });
  }

  $scope.cancel = function(){
    $state.go("app.users");
  }

  validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  }

  $scope.updateUser = function(){
    if ($scope.isEdit)
    {
      UserService.updateProfileByID($scope.webtoken, $scope.edituser).success(function(cb) {
        if (cb.success == true)
        {
          $("#notification_success").fadeIn("slow").html('Successfully updated.').delay(1000).fadeOut('slow');
        }else{
          $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
        }
      });
    }else{
      if (!validateEmail($scope.edituser.email))
      {
        $("#notification").fadeIn("slow").html('Invalid email.').delay(1000).fadeOut('slow');
        return;
      }

      if ($scope.password1 == "" || $scope.password1 != $scope.password2)
      {
        $("#notification").fadeIn("slow").html('Invalid password fields.').delay(1000).fadeOut('slow');
        return;
      }

      if ($scope.password1.length < 5)
      {
        $("#notification").fadeIn("slow").html('Password length must be greater than 5.').delay(1000).fadeOut('slow');
        return;
      }

      $scope.edituser.password = $scope.password1;
      UserService.userRegister($scope.edituser).success(function(cb) {
        if (cb.success == true)
        {
          $("#notification_success").fadeIn("slow").html('Successfully saved.').delay(1000).fadeOut('slow');
          $state.go("app.users");
        }else{
          $("#notification").fadeIn("slow").html('Duplicate email or username.').delay(1000).fadeOut('slow');
        }
      });
    }
  }
}]);