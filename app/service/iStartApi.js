'use strict';
(function() {
    var app  = angular.module('istart');
    app.factory('istartApi', ['$q', '$rootScope', '$timeout',
     function ($q, $rootScope, $timeout ) {
         var gapiReady=false;
         var loopCount=0;
         var token = "";
        $rootScope.$on('backendReady', function() {
            /**
             * checks if the backend is ready
             */
            console.log('backendReady');
            gapiReady=true;
        });

        var setToken = function(token) {
            token =token;
            gapi.auth.setToken(createTokenObject(token));
        };

        var fetchListRemote = function() {
            var defer = $q.defer();

            var loadData = function() {
                console.log('LOAD LOAD');
                if(gapiReady==false) {
                    if(loopCount==10) {
                        loopCount=0;
                        defer.reject();//reject when offline
                        return;
                    } else {
                        loopCount++;
                        console.log('timeout');
                        $timeout(loadData, 500);
                    }
                    return;
                }
                console.log('load Data inside loader');
                gapi.client.istart.tiles.list().execute(function(resp) {
                    console.log(resp);
                    defer.resolve(resp);
                });
            };
            loadData();
            return defer.promise;
        };

         var fetchMeRemote = function() {
             var defer = $q.defer();

             var loadData = function() {
                 console.log('LOAD LOAD');
                 if(gapiReady==false) {
                     if(loopCount==10) {
                         loopCount=0;
                         defer.reject();//reject when offline
                         return;
                     } else {
                         loopCount++;
                         console.log('timeout');
                         $timeout(loadData, 500);
                     }
                     return;
                 }
                 console.log('load Data inside loader');
                 gapi.client.istart.users.get({id:'me'}).execute(function(resp) {
                     console.log(resp);
                     defer.resolve(resp);
                 });
             };
             loadData();
             return defer.promise;
         };

        return {
            getFeed: fetchListRemote,
            getMe: fetchMeRemote,
            setToken:setToken
        };
    }]);
    function createTokenObject(tokenString) {
        var token= {
            "access_token": tokenString,
            "token_type": "Bearer"
        };
        try {
            window.localStorage.setItem('token', JSON.stringify(token));
        } catch(e) {

        }
        return token;
    };
})();