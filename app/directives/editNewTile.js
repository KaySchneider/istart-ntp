'use strict';
/**
 *
 *
 */
var app = angular.module('istartMetroDirective');

app.directive('editTileBottom', function() {
    return {
        restrict: 'E',
        scope: {
            tileInfo:'=tileInfo',
            showEdit:'=editTile'
        },
        templateUrl:'../html/views/editTileBottom',
        link: function(scope, element, attrs) {

        }

    }
});

