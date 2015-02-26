'use strict';
var app  = angular.module('istart');
app.factory('iconService', ['$http', '$q',function ($http, $q) {

    var sysIcons=[];

    var getSysIcons=function() {
        var defer = $q.defer();
        if(sysIcons.length==0) {
            //no icons are loaded
            $http.get('../app/defaultIcons.json')
                .success(function(icons) {
                    sysIcons = icons;
                    defer.resolve(sysIcons);
                })
                .error(function(e) {
                    console.error(e);
                    defer.reject();
                });
        } else {
            defer.resolve(sysIcons);
        }
        return defer.promise;
    };

    /**
     * returns the current apps list!
     */
    return {
        'getSystemIcons':getSysIcons
    };
}]);
