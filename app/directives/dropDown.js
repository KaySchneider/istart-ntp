'use strict';
/**
 * Created by ikay on 12.01.15.
 */
var app = angular.module('istartMetroDirective');
app.directive('dropDown', function() {
    return {
        restrict: 'E',
        scope: {
            items:'=item',
            id:'=dropid',
            editMode:'=editMode',
            tile:'=tile'
        },
        templateUrl: '../html/views/dropDown.html',
        controller: ['$scope', function( $scope ) {
            $scope.openmenu=false;
            //we need for every menu item an call to action service!
            $scope.menuOpen = function() {
                switch($scope.openmenu) {
                    case true:
                        $scope.openmenu=false;
                        break;
                    case false:
                        $scope.openmenu=true;
                        break;
                }
            };
        }],
        link: function(scope, element, attrs) {

        }
    }
});
