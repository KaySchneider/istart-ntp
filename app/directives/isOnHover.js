'use strict';
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('isOnHover', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
        //    console.log('is On hover');

        }

    }
});
