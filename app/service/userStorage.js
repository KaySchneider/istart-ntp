'use strict';
var app  = angular.module('istart');
app.factory('userStorage',[ '$q', '$rootScope',
    function($q, $rootScope) {
        var user = null;
        var getCurrentUser = function() {
            var defer = $q.defer();
            if(user !== null) {
                defer.resolve(user);//use the local cache! TODO:move this to angularCacheFactory!
            } else {
                chrome.storage.local.get('cloudUser', function(data) {
                   if(data.cloudUser) {
                       try {
                           user = JSON.parse(data.cloudUser);
                           defer.resolve(user);
                       } catch(e) {
                           defer.reject(e);
                       }
                   } else {
                       console.log('REJECT');
                        defer.reject(false);
                   }
                });
            }
            return defer.promise;
        };
        var setCurrentUser = function(userObject) {
            userObject.saveTime = Date.now();//set the current time whenever we store the local user we can decide with this time to fetch new data from server!
            chrome.storage.local.set({'cloudUser':JSON.stringify(userObject)},function(d) {
                console.log(d);
            })
        };

        /**
         * clears user object storage
         */
        var clearCurrentUser = function() {
            chrome.storage.local.remove('cloudUser');
        };

        $rootScope.$on('userLogout',  function() {
            clearCurrentUser();
        });

        return {
            getMe:getCurrentUser,
            setMe:setCurrentUser
        }
    }
]);

