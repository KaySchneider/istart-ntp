/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective', []);
app.directive('metroItem', function() {
    return {
        templateUrl: 'views/tile.html',
        restrict: 'E',
        replace: false,
        scope: {
            tileInfo: '=',
            editMode: '='
        },
        link: function (scope, element, attrs) {
            /**
             * scope effects for mouse over and mouseout functions
             * to animate the search forms on the tiles!
             */
            angular.element(element[0]).on('mouseover', function () {
                if (scope.hover === false) {
                    scope.hover = true;
                    scope.$apply();
                }
            });
            angular.element(element[0]).on('mouseout', function () {
                if (scope.hover === true) {
                    scope.hover = false;
                    scope.$apply();
                }
            });
        },
        controller: ['$scope' , '$rootScope','$mdDialog', function ($scope, $rootScope, $mdDialog) {
            console.log($scope.tileInfo);
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
            if ($scope.tileInfo.min_width) {
                $scope.tileInfo.w = $scope.tileInfo.min_width;
            }

            if ($scope.tileInfo.min_height) {
                $scope.tileInfo.h = $scope.tileInfo.min_height;
            }

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
        }]
    }
});
app.directive('myRepeatDirective', function() {
    return function(scope, element, attrs) {
        //angular.element(element).css('color','blue');
        if(scope.item) {
            if(scope.item[0].w) {
                if(scope.item[0].w == 2 && scope.item[0].h == 2)
                    angular.element(element).attr('flex', 50);
            }
        }
        if (scope.$last){
            addDnD();
        }
    };
});