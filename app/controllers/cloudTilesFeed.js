'use strict';
(function() {
    var app = angular.module('istart');
    app.controller('cloudTilesFeedCtrl', [ '$scope','matrix', '$rootScope','istartApi',
        function($scope,matrix, $rootScope, istartApi ) {
            /**
             * show the feed from the backend, we use now to simplify the development an own controller and UI
             */
            $scope.feed=null;
            $scope.token = "";

            $scope.fetchMe = function() {
                istartApi.getMe().then(function(data) {
                    console.log('ME', data);
                });
            };

            $scope.login = function() {

                chrome.identity.getAuthToken({ 'interactive': true }, function(token) {
                    // Use the token.
                    console.log(token, 'CHROME AUTH');
                    $scope.token = token;
                    istartApi.setToken(token);
                });
            };
            $scope.load = function() {
                istartApi.getFeed().then(function(items) {
                    console.log('CALLBACK INSIDE THE GETFEED METHOD');
                    $scope.feed = items.items;
                    console.log($scope.feed);
                    //$scope.$apply();
                });
            };
            $scope.load();
        }]);
})();

