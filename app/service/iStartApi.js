'use strict';
(function() {
    var app  = angular.module('istart');
    app.factory('istartApi', ['$q', '$rootScope', '$timeout','$http',
     function ($q, $rootScope, $timeout , $http) {
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




        var loadSilent = function() {
            /*chrome.identity.getAuthToken({ 'interactive': false }, function(token) {
                // Use the token.
                console.log(token, 'CHROME AUTH');
                setToken(token);
            });*/

            token = window.localStorage.getItem('token');
            console.log(token);
        };

         /**
          *
          * @param loginData
          * var loginData = {
                 'username':""
                 'password': ""
             };
          */
         var login = function(loginData) {
             var defer = $q.defer();
             $http.post($rootScope.authEndpoints + '/api/login',{username:loginData.mail, password:loginData.password} )
                 .success(function(data) {
                     gapi.auth.setToken(createTokenObject(data.id + '||' + data.token));
                     gapi.client.istart.users.get({id:'me'}).
                         execute(function(res,err) {
                             defer.resolve(res);
                         });
                 })
                 .error(function(err) {
                     console.log('login Error', err);
                     defer.reject(err);
                 });
             return defer.promise;
         };

         var logout = function() {
             /**
              * TODO: destroy here the local scope and log the user out!
               */
             $http.post( $rootScope.authEndpoints + '/api/logout', {'t':gapi.auth.getToken()})
                 .success(function(data) {
                     console.log(data);
                     gapi.auth.setToken(null);
                     if(localStorage) {
                         localStorage.setItem('token', null);
                     }
                     $rootScope.$broadcast('userLogout');
                     defer.resolve(data);
                 })
                 .error(function(err) {
                     defer.reject(err);
                 });
         };

         /**
          * register new iStart user!
          */
        var registerNewUser = function(userRegisterObject) {
             var defer = $q.defer();

             gapi.client.istart.users.register({
                 username: userRegisterObject.username,
                 password: userRegisterObject.password,
                 email: userRegisterObject.email
             }).execute(function(res,err) {
                 console.log(res, 'RESULT');
                 console.log(res.id);
                 console.log(err, 'ERR');
                 if(res.error) {
                     defer.reject(res);
                 }
                 if(res.id) {
                     defer.resolve(res);
                 }
             });

             return defer.promise;
        };

        var patchUserName = function(patchObject) {
            var defer = $q.defer();
            gapi.client.istart.users.patch(patchObject).execute(function(resp) {
                defer.resolve(resp);
                $rootScope.$broadcast('usernamechanged', {username:patchObject.username});
            });
            return defer.promise;
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
                     if(loopCount==20) {
                         loopCount=0;
                         defer.reject();//reject when offline
                         return;
                     } else {
                         loopCount++;
                         console.log('timeout');
                         $timeout(loadData, 800);
                     }
                     return;
                 }
                 console.log('load Data inside loader');
                 if(token != "") {
                     try {
                        gapi.auth.setToken(JSON.parse(token));
                     } catch(e) {

                     }
                 }
                 gapi.client.istart.users.get({id:'me'}).execute(function(resp) {
                     console.log(resp);
                     defer.resolve(resp);
                 });
             };
             loadData();
             return defer.promise;
         };
        loadSilent();
        return {
            getFeed: fetchListRemote,
            getMe: fetchMeRemote,
            setToken:setToken,
            patchUser:patchUserName,
            register:registerNewUser,
            login:login,
            logout:logout
        };
    }]);
    function createTokenObject(tokenString) {
        var token= {
            "access_token": tokenString,
            "token_type": "Sharer"
        };
        try {
            window.localStorage.setItem('token', JSON.stringify(token));
        } catch(e) {

        }
        return token;
    };
})();