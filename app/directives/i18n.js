'use strict';
/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('i18n', ['$compile' ,function($compile) {
    return {
        restrict: 'E',
        replace: true,
        controller: ['$scope','i18n', function($scope, i18n) {
            $scope.translate = function(string) {
                return i18n.chrome.getMessage(string);
            };
        }],
        link: function(scope, element, attrs) {
            var s = angular.element(element).html();
            var e = scope.translate(s);
            console.log(e, s);
            element.replaceWith(e);
        }

    }
}]);

