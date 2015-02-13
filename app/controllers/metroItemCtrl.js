'use strict';
'use strict';
var app = angular.module('istart');
app.controller('metroItemCtrl', ['$scope' , '$rootScope','$mdDialog', function ($scope, $rootScope, $mdDialog) {
    $scope.$watch('tileInfo', function (info,mote) {
        if($scope.tileInfo !== 'undefined') {
            console.log($scope.tileInfo, 'INFO');
            $scope.run();
        }
    });
    $scope.addhover = function() {
        var element = $('#item'+$scope.$index);
        console.log("ELEMENT", element);
        element.on('mouseover', function () {
            if (scope.hover === false) {
                scope.hover = true;
                scope.$apply();
            }
        });
        element.on('mouseout', function () {
            if (scope.hover === true) {
                scope.hover = false;
                scope.$apply();
            }
        });
    };

    $scope.run = function() {
        $scope.addhover();
        $scope.config = $scope.tileInfo.config;
        $scope.hover = false;
        $rootScope.addUUIDTOList($scope.tileInfo.uuid);
        //console.log($scope.tileInfo, "scope");
        //check here the config for different tile types!
        /**
         * ÜBerlegungen anstreben wie die verschiedenen Tiles am besten abgebildet werden können.
         * Auch in Anbetracht der unterschiedlichen Optionen welchen vom Nutzer konfiguriert werden können.
         * Dort muss es auch eine Einheitliche Methode geben!
         */


        /**
         * add hover events
         *
         */

        $scope.dropDownOptions = {
            'menuLabel': 'options',
            'items': [
                {
                    'label': 'configuration',
                    'action': $scope.showColorChooserTile,
                    'data': $scope.tileInfo,
                    'editMode': $scope.editMode,
                    'edittile':true
                },
                {
                    'label':'delete',
                    'editMode': $scope.editMode,
                    'data':$scope.tileInfo,
                    'action': $scope.removeItem
                }
            ]
        };
    };

    $scope.$index = $scope.$parent.$index;
    $scope.outerIndex = $scope.$parent.$parent.$index;

    $scope.showColorChooserTile = function (ev,data) {
        console.log(data);
    };


    $scope.removeItem = function(ev,tileInfo) {
        var name= (tileInfo.label ? tileInfo.label :tileInfo.name);
        var confirm = $mdDialog.confirm()
            .title('Delete the tile: ' + name)
            .content('All of the banks have agreed to forgive you your debts.')
            .ariaLabel('DELETE TILE')
            .ok('Delete')
            .cancel('cancel')
            .targetEvent(ev);
        $mdDialog.show(confirm).then(function() {
            $rootScope.$broadcast('removeTile', tileInfo);
        }, function() {
        });
    };


}]);
