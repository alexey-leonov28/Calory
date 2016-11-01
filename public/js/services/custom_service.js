'use strict';

/* Services */
var CustomService = angular.module('CustomService', ['ngResource']);

CustomService.factory('MealService',['$http',
    function($http){
        
        return {
            getFullList: function(webtoken) {
                return $http.get("/api/meals/getFullList?token=" + webtoken);
            },

            getList: function(webtoken) {
                return $http.get("/api/meals/getList?token=" + webtoken);
            },

            getFullList: function(webtoken) {
                return $http.get("/api/meals/getFullList?token=" + webtoken);
            },

            deleteEntryByID: function(webtoken, id)
            {
                return $http.get("/api/meals/deleteEntryByID/" + id + "?token=" + webtoken);
            },

            deleteEntryUnlimited: function(webtoken, id)
            {
                return $http.get("/api/meals/deleteEntryUnlimited/" + id + "?token=" + webtoken);
            },

            updateEntryUnlimited: function(webtoken, params)
            {
                return $http.post("/api/meals/updateEntryUnlimited/" + params._id + "?token=" + webtoken, params);
            },

            updateEntry: function(webtoken, params)
            {
                return $http.post("/api/meals/updateEntryByID/" + params._id + "?token=" + webtoken, params);
            },

            getInformationUnlimitedByID: function(webtoken, id)
            {
                return $http.get("/api/meals/getInformationUnlimitedByID/" + id + "?token=" + webtoken);
            },

            getInformationByID: function(webtoken, id)
            {
                return $http.get("/api/meals/getInformationByID/" + id + "?token=" + webtoken);
            },
            
            newEntryUnlimited: function(webtoken, entry)
            {
                return $http.post("/api/meals/addUnlimited?token=" + webtoken, entry);
            },

            newEntry: function(webtoken, entry)
            {
                return $http.post("/api/meals/add?token=" + webtoken, entry);
            },
        }
    }
]);