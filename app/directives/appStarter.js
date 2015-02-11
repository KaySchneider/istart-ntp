'use strict';
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 * Starts an app with the appLauncher sevice
 */

var app = angular.module('istartMetroDirective');

app.directive('appStarter', function() {
    return {
        restrict: 'A',
        controller: ['$scope','appLauncher', '$rootScope',
        function($scope, appLauncher, $rootScope) {
            //check if we had already registered this appId on this scopes events!
            if(!$scope.appIdHandler) {
                $scope.removeHandler = $rootScope.$on('startApp' + $scope.app.id, function() {
                    $scope.launchApp();
                });
                $scope.appIdHandler = true;
            }
            $scope.$on('$destroy', function() {
                //REMOVES THE HANDLER WHEN THE ELEMENT WILL BE DELETED FROM THE DOM
                //TODO: we call this method n times, how many times the directive is added in this scope in the DOM
                //TODO: fix this,.. but nothing bad happens here.
                if($scope.removeHandler) {
                    $scope.removeHandler();
                }
            });
            $scope.launchApp = function() {
                /**
                 * TODO: add google tracking code here
                 * TO TRACK ON WICH PAGE THE USER STARTS THE APPS
                 */
                console.log('launch app');
                appLauncher.launch($scope.app);
            };
        }],
        link: function(scope, element, attrs) {
            angular.element(element[0]).on('click', function() {
                scope.launchApp();
            });
        }

    }
});

