'use strict';
var app = angular.module('istartMetroDirective');
app.directive('appVersion', function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<span>istart version number: {{version}}</span>',
        controller: ['$scope','appdata',function($scope, appdata) {
            $scope.version = appdata.manifest.version;
        }]
    };
})
