'use strict';
/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('desktopBackground', function() {
    return {
        restrict: 'A',
        controller: ['$scope','$rootScope', function($scope, $rootScope) {
            $scope.root = $rootScope;
        }],
        link: function(scope, element, attrs) {
            /**
             * check the possible background settings
             */
        }

    }
});


