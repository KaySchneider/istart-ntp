'use strict';
/**
 * Created by ikay on 09.02.15.
 *
 */
var app = angular.module('istartMetroDirective');

app.directive('fileInput', function() {
    return {
        restrict: 'A',
        scope: {
            file:'=filevar'
        },
        link: function(scope, element, attrs) {
            element.on('change', function() {
                scope.file = element[0].files;
            });
        }

    }
});
