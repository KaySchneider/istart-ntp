'use strict';
var app  = angular.module('istart');
app.factory('permissionCheck',['$q',function($q){
    return {
        checkPerm : function(perm){
            var defer = $q.defer();
            chrome.permissions.contains({
                permissions: [perm]
            }, function(result) {
                if (result) {
                    // The extension has the permissions.
                    defer.resolve(true);
                } else {
                    // The extension doesn't have the permissions.
                    defer.resolve(false);
                }
            });
            return defer.promise;
        }
    }
}]);
