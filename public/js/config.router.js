'use strict';

/**
 * Config for the router
 */
angular.module('app')
  .run(
    [          '$rootScope', '$state', '$stateParams', '$localStorage', 
      function ($rootScope,   $state,   $stateParams, $localStorage) {
          $rootScope.$state = $state;
          $rootScope.$stateParams = $stateParams;        
      }
    ]
  )
  .config(
    [          '$stateProvider', '$urlRouterProvider', 'JQ_CONFIG', 'MODULE_CONFIG', 
      function ($stateProvider,   $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
        var layout = "tpl/app.html";
        $urlRouterProvider.otherwise('/app/profile');
        
        $stateProvider
            .state('app', {
                abstract: true,
                url: '/app',
                controller: 'AppCtrl', 
                templateUrl: layout
            })
            .state('app.profile', {
              url: '/profile',
              templateUrl: 'tpl/page_profile.html',
              resolve: load( ['js/controllers/profile.js'] )
            })
            .state('app.users', {
              url: '/users',
              templateUrl: 'tpl/page_users.html',
              resolve: load( ['js/controllers/users.js'] )
            })
            .state('app.calendar', {
              url: '/calendar',
              templateUrl: 'tpl/page_calories.html',
              resolve: load( ['js/controllers/calories.js'] )
            })
            .state('app.edituser', {
              url: '/user/:id',
              templateUrl: 'tpl/page_edituser.html',
              resolve: load( ['js/controllers/users.js'] )
            })
            .state('app.editentry', {
              url: '/entry/:id',
              templateUrl: 'tpl/page_editentry.html',
              resolve: load( ['js/controllers/calories.js'] )
            })
            .state('access', {
              url: '/access',
              template: '<div ui-view class="fade-in-right-big smooth"></div>'
            })
            .state('access.signin', {
              url: '/signin',
              templateUrl: 'tpl/page_signin.html',
              resolve: load( ['js/controllers/signin.js'] )
            })
            .state('access.signup', {
              url: '/signup',
              templateUrl: 'tpl/page_signup.html',
              resolve: load( ['js/controllers/signup.js'] )
            });

        

        function load(srcs, callback) {
          return {
              deps: ['$ocLazyLoad', '$q',
                function( $ocLazyLoad, $q ){
                  var deferred = $q.defer();
                  var promise  = false;
                  srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
                  if(!promise){
                    promise = deferred.promise;
                  }
                  angular.forEach(srcs, function(src) {
                    promise = promise.then( function(){
                      if(JQ_CONFIG[src]){
                        return $ocLazyLoad.load(JQ_CONFIG[src]);
                      }
                      angular.forEach(MODULE_CONFIG, function(module) {
                        if( module.name == src){
                          name = module.name;
                        }else{
                          name = src;
                        }
                      });
                      return $ocLazyLoad.load(name);
                    } );
                  });
                  deferred.resolve();
                  return callback ? promise.then(function(){ return callback(); }) : promise;
              }]
          }
        }
      }
    ]
  );
