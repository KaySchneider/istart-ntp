'use strict';
var app  = angular.module('istart');
app.factory('rssService',['$http',function($http){
    return {
        parseFeed : function(url){
            return $http.get('http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=50&q=' + encodeURIComponent(url))
        }
    }
}]);