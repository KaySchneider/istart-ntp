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
            element.on('mouseover', function() {
                console.log('Hover');
                scope.hover=true;
                scope.$apply();
            })
                .on('mouseout', function() {
                    console.log('out');
                    scope.hover=false;
                    scope.$apply();
                });

        }

    }
});
