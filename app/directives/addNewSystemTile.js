'use strict';
var app = angular.module('istartMetroDirective');
app.directive('addNewSystemTile', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: {
            tile:'=tile'
        }, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'analytics',
            'systemLiveTiles',
            function ($scope, $mdDialog, $rootScope, $window, $q, $http, analytics, systemLiveTiles ) {
                var ps = $scope;
                $scope.edit=false;
                $scope.DialogController = ['$scope', '$mdDialog', '$window','analytics',
                    function($scope, $mdDialog, $window, analytics) {
                        analytics.track('showAddNewSystemTile', 'system');

                        $scope.loadSearchTilesConfig = function() {
                            var deferred = $q.defer();
                            deferred.resolve(systemLiveTiles.items);
                            return deferred.promise;
                        };

                        $scope.searchTiles=[];
                        $scope.edit = ps.edit;
                        $scope.tldconf=false;
                        $scope.defaultProtocol = 'http://';
                        $scope.activeItem = null;
                        $scope.tldEdit=false;

                        $scope.setItemActive = function(index) {
                            $scope.tldEdit=false;
                            $scope.activeItem = index;
                            $scope.tile=$scope.searchTiles[index][0];
                        };

                        //$scope.edit=false;
                        $scope.checkCurr = function(selectIndex) {
                            $scope.tldcheck = selectIndex;
                        };



                        $scope.loadSearchTilesConfig()
                            .then(function(data) {
                                $scope.searchTiles=data;
                            });

                        $scope.hide = function() {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        $scope.answer = function(answer) {
                            console.log('CLOSE');
                            $mdDialog.hide(answer);
                        };


                        $scope.CheckLabel = function() {

                        };

                        /**
                         * check the current tiles configuration
                         */
                        $scope.checkconfig = function() {

                            $scope.tile.uuid = $rootScope.getUniqueUUID();
                            $mdDialog.hide($scope.tile);
                        };
                    }];
                $scope.showAdvanced = function (ev) {
                    $mdDialog.show({
                        controller: $scope.DialogController,
                        templateUrl: '../html/views/addNewSystemTile.html',
                        targetEvent: ev
                    })
                        .then(function (tileConfig) {
                            console.log('ADD TILE TO THE DATABASE', tileConfig.uuid);
                            $rootScope.addUUIDTOList(tileConfig.uuid);
                            $rootScope.$broadcast('addNewTile', tileConfig);
                            analytics.track('addNewLiveTile', 'addTile', {value:tileConfig.link});
                        }, function () {
                            //do nothing when cancel
                        });
                }
            }],
        link: function(scope, element, attrs) {
            /**
             * TODO: add edit mode for tiles
             */
            if('mode' in attrs.$attr) {
                scope.edit = true;

            }
            angular.element(element).on('click', function($event) {
                scope.showAdvanced($event);
            });
        }
    }
});


