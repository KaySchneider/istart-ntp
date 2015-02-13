'use strict';
'use strict';
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 * Starts an app with the appLauncher sevice
 */

var app = angular.module('istartMetroDirective');

app.directive('istartSearchBar', function() {
    return {
        restrict: 'E',
        templateUrl: 'views/istartSearchBar.html',
        controller: ['$scope','appLauncher', '$rootScope',
            function($scope, appLauncher, $rootScope) {
                //check if we had already registered this appId on this scopes events!
                $scope.hover=false;
                $scope.config = $scope.item[0].config;
            }],
        link: function(scope, element, attrs) {
                console.log(element.parent().parent().parent(), "ELEMENT INSIDE LINK");

            element.parent().parent().parent().on('mouseover', function () {
                if (scope.hover === false) {
                    scope.hover = true;
                    scope.$apply();
                }
            });
            element.parent().parent().parent().on('mouseout', function () {
                if (scope.hover === true) {
                    scope.hover = false;
                    scope.$apply();
                }
            });
        }

    }
});


