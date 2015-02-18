'use strict';
var app = angular.module('istart');
app.controller('fullScreenWidgetCtrl', [ '$scope','$stateParams', 'systemLiveTiles',
    function($scope, $stateParams, systemLiveTiles) {
        $scope.widgetId = $stateParams.extensionid;
        console.log($stateParams.extensionid, $scope);
        $scope.getWidgetConfigItem = function() {
            var tiles = systemLiveTiles.items;
            for(var item in tiles) {
                if(tiles[item][0].extensionid == $scope.widgetId) {
                    return tiles[item][0];
                }
            }
        };

        $scope.widgetConfig = $scope.getWidgetConfigItem();
    }]);

