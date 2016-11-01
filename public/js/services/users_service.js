'use strict';

/* Services */
var UsersService = angular.module('UsersService', ['ngResource']);

UsersService.factory('UserService',['$http',
    function($http){   
        
        return {
            userRegister: function(params) {
                return $http.post("/api/users/register", params);
            },

            userAuthenticate: function(params) {
                return $http.post("/api/users/auth", params);
            },

            updateProfile: function(webtoken, params){
              return $http.post("/api/users/updateProfile?token=" + webtoken, params);  
            },

            updatePassword: function(webtoken, password){
              return $http.post("/api/users/updatePassword?token=" + webtoken, {password: password});  
            },

            getUserList: function(webtoken){
              return $http.get("/api/users/getList?token=" + webtoken);
            },

            updateProfileByID: function(webtoken, params){
              return $http.post("/api/users/updateProfileById/" + params._id + "?token=" + webtoken, params);  
            },

            deleteUserByID: function(webtoken, id){
              return $http.get("/api/users/deleteById/" + id + "?token=" + webtoken);
            },

            getUserInfoById: function(webtoken, id){
              return $http.get("/api/users/getUserInfoById/" + id + "?token=" + webtoken);
            },
        }
    }
]);