'use strict';
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 * Starts an app with the appLauncher sevice
 */

var app = angular.module('istartMetroDirective');
app.directive('repeatTiles', function() {
    return {
        restrict: 'A',
        controller: ['$scope','appLauncher', '$rootScope', function($scope, appLauncher, $rootScope) {
            //check if we had already registered this appId on this scopes events!

        }],
        link: function(scope, element, attrs) {
            console.log(attrs);
            element.on('click', function() {
                scope.launchApp();
            });
        }

    }
});


