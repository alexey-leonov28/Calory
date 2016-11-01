/* Controllers */
app.controller('caloryListCtrl', ['$scope', '$http', '$state', '$localStorage', 'MealService', 'UserService', 
              function($scope, $http, $state, $localStorage, MealService, UserService) {

    $scope.calories = [];
    $scope.users = [];

    if ($scope.user.role == 2)
	{
		$state.go("app.profile");
	}

	var getFullList = function(cb){
		MealService.getFullList($scope.webtoken).success(function(dt) {
	      if (dt.entries)
	      {
	        $scope.calories = dt.entries;

	        for (var i = 0; i < $scope.calories.length; i ++)
	        {
	        	if (typeof $scope.users[$scope.calories[i].userID] == "undefined")
	        	{
	        		$scope.calories[i].user = "Unknown";
	        	}else{
	        		$scope.calories[i].user = $scope.users[$scope.calories[i].userID].username;
	        	}
	        }

	        $scope.$watch('calories', function() {
	            $('.footable').trigger('footable_redraw');
	        });

	        if (cb) cb();
	      }
	    });
	}

	var getMyList = function(cb){

		if ($scope.user.role == 1)
		{
			MealService.getFullList($scope.webtoken).success(function(dt) {
		      if (dt.entries)
		      {
		        $scope.calories = dt.entries;

		        $scope.$watch('calories', function() {
		            $('.footable').trigger('footable_redraw');
		        });

		        if (cb) cb();
		      }
		    });
		}
		else{
			MealService.getList($scope.webtoken).success(function(dt) {
		      if (dt.entries)
		      {
		        $scope.calories = dt.entries;

		        $scope.$watch('calories', function() {
		            $('.footable').trigger('footable_redraw');
		        });

		        if (cb) cb();
		      }
		    });
		}
	}

	var deleteEntry = function(id)
	{
		if ($scope.user.role == 1)
      	{
            MealService.deleteEntryUnlimited($scope.webtoken, id).success(function(cb) {
              if (cb.success == true)
              {
                $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
                updateEntryData();
              }else{
                $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
                updateEntryData();
              }
            });
        }else{
        	MealService.deleteEntryByID($scope.webtoken, id).success(function(cb) {
              if (cb.success == true)
              {
                $("#notification_success").fadeIn("slow").html('Successfully deleted.').delay(1000).fadeOut('slow');
                updateEntryData();
              }else{
                $("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
                updateEntryData();
              }
            });
        }
	}

	$scope.removeEntry = function(id)
	{
		if (confirm("Do you really want to remove the entry?"))
		{
	        for (var i = 0; i < $scope.calories.length; i ++)
	        {
				if ($scope.calories[i]._id == id)
				{
	          		deleteEntry(id);
	            	break;
				}
	        }
		}
	}

	$scope.editEntry = function(id)
	{
		$state.go("app.editentry", {id: id});
	}

	var updateEntryData = function(cb){
	    if ($scope.user.role == 1)
	    {
	    	// admin
		    UserService.getUserList($scope.webtoken).success(function(dt) {
		      if (dt.users)
		      {
		      	for (var i = 0; i < dt.users.length; i ++)
		      		$scope.users[dt.users[i]._id] = dt.users[i];

		      	getFullList(cb);
		      }
		    });
		}else{
	      	getMyList(cb);
		}
	}

	$scope.filter = function(){
		updateEntryData(function(){
			var tmp = JSON.parse(JSON.stringify($scope.calories));
			$scope.calories = [];

			var start_date = new Date($scope.date1);
			var end_date = new Date($scope.date2);

			var start_time = new Date('01/01/2011 ' + $scope.time1);
			var end_time = new Date('01/01/2011 ' + $scope.time2);

			for (var i = 0; i < tmp.length; i ++)
			{
				if (new Date(tmp[i].date) >= start_date &&  new Date(tmp[i].date) <= end_date &&
					new Date('01/01/2011 ' + tmp[i].time) >= start_time &&  new Date('01/01/2011 ' + tmp[i].time) <= end_time)
				{
					$scope.calories.push(tmp[i]);
				}
			}

	        $scope.$watch('calories', function() {
	            $('.footable').trigger('footable_redraw');
	        });
		});
	}

	$scope.clearfilter = function(){
		$scope.date1 = "2010-01-01"; $scope.date2 = new Date().getFullYear() + "-12-31";
		$scope.time1 = "00:00:00"; $scope.time2 = "23:59:59";

		$scope.filter();
	}

	$scope.clearfilter();
}]);

app.controller('entryEditCtrl', ['$stateParams', '$scope', '$http', '$state', '$localStorage', 'MealService', 'UserService', 
              function($stateParams, $scope, $http, $state, $localStorage, MealService, UserService) {

    $scope.isEdit = false;
    $scope.editentry = {};
    $scope.users = [];

    if ($scope.user.role == 2)
	{
		$state.go("app.profile");
	}

    if ($stateParams.id !== ""){
		$scope.isEdit = true;

		if ($scope.user.role == 1)
		{
			MealService.getInformationUnlimitedByID($scope.webtoken, $stateParams.id).success(function(cb) {
				if (cb.success == true)
				{
					$scope.editentry = cb.entry;
				}
			});
		}else{
			MealService.getInformationByID($scope.webtoken, $stateParams.id).success(function(cb) {
				if (cb.success == true)
				{
					$scope.editentry = cb.entry;
				}
			});
		}
	}

	if ($scope.user.role == 1)
	{
		UserService.getUserList($scope.webtoken).success(function(dt) {
			if (dt.users)
			{
				$scope.users = dt.users;
			}
		});
	}

	$scope.cancel = function(){
		$state.go("app.calendar");
	}

	var isValidDate = function(date)
	{
	    var matches = /^(\d{4})[-\/](\d{2})[-\/](\d{2})$/.exec(date);
	    if (matches == null) return false;
	    var d = matches[3];
	    var m = matches[2] - 1;
	    var y = matches[1];
	    var composedDate = new Date(y, m, d);

	    return composedDate.getDate() == d &&
	            composedDate.getMonth() == m &&
	            composedDate.getFullYear() == y;
	}
	var timeFormat = /^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/;

	$scope.updateEntry = function(){
		if ($scope.user.role == 3)
		{
			$scope.editentry.userID = $scope.user._id;
		}

		if ($scope.user.role == 1)
		{
			if (typeof $scope.editentry.userID == "undefined")
			{
				$("#notification").fadeIn("slow").html('You must select user.').delay(1000).fadeOut('slow');
				return;
			}
		}

		if (!isValidDate($scope.editentry.date))
		{
			$("#notification").fadeIn("slow").html('Invalid date format.').delay(1000).fadeOut('slow');
			return;
		}

		if(timeFormat.test($scope.editentry.time) == false)
		{
			$("#notification").fadeIn("slow").html('Invalid time format.').delay(1000).fadeOut('slow');
			return;
		}

		if ($scope.isEdit)
		{
			if ($scope.user.role == 1)
			{
				MealService.updateEntryUnlimited($scope.webtoken, $scope.editentry).success(function(cb) {
					if (cb.success == true)
					{
						$("#notification_success").fadeIn("slow").html('Successfully updated.').delay(1000).fadeOut('slow');
					}else{
						$("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
					}
				});
			}else{
				MealService.updateEntry($scope.webtoken, $scope.editentry).success(function(cb) {
					if (cb.success == true)
					{
						$("#notification_success").fadeIn("slow").html('Successfully updated.').delay(1000).fadeOut('slow');
					}else{
						$("#notification").fadeIn("slow").html('Not found.').delay(1000).fadeOut('slow');
					}
				});
			}
		}else{

			if ($scope.user.role == 1)
			{
				MealService.newEntryUnlimited($scope.webtoken, $scope.editentry).success(function(cb) {
					if (cb.success == true)
					{
						$("#notification_success").fadeIn("slow").html('Successfully saved.').delay(1000).fadeOut('slow');
						$state.go("app.calendar");
					}else{
						$("#notification").fadeIn("slow").html('Failed to save.').delay(1000).fadeOut('slow');
					}
				});
			}else{
				MealService.newEntry($scope.webtoken, $scope.editentry).success(function(cb) {
					if (cb.success == true)
					{
						$("#notification_success").fadeIn("slow").html('Successfully saved.').delay(1000).fadeOut('slow');
						$state.go("app.calendar");
					}else{
						$("#notification").fadeIn("slow").html('Failed to save.').delay(1000).fadeOut('slow');
					}
				});
			}
		}
	}
}]);