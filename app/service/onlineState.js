'use strict';
var app  = angular.module('istart');
app.factory('onlineState',['$window',function($window){

    /**
     * TODO: implement the state changes events
     */
    return {
        get: function() {
            if($window.navigator) {
                if($window.navigator.onLine) {
                    return $window.navigator.onLine;
                }
            }
        }
    }
}]);

