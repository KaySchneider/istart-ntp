'use strict';
var app = angular.module('istartMetroDirective');
app.directive('addNewSearchTile', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: {
            tile:'=tile'
        }, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'analytics',
         function ($scope, $mdDialog, $rootScope, $window, $q, $http, analytics ) {
            var ps = $scope;
            $scope.edit=false;
            $scope.DialogController = ['$scope', '$mdDialog', '$window','analytics',
                function($scope, $mdDialog, $window, analytics) {

                    analytics.track('showAddNewSearchTileDialog', 'system');
                    $scope.loadSearchTilesConfig = function() {
                        var deferred = $q.defer();
                        $http.get('../app/searchTiles.json')
                            .success(function(data, status, headers, config) {
                                console.log(data, status, headers, config);
                                deferred.resolve(data);
                            })
                            .error(function(data, status, headers, config) {
                                console.error(data, status, headers, config, 'ERROR');
                                alert('CANT LOAD THE DEFAULT TILES :( defaultTiles.json  ');
                                deferred.reject('error');
                            });
                        return deferred.promise;
                    };
                    $scope.searchTiles=[];
                    $scope.edit = ps.edit;
                    $scope.tldconf=false;
                    $scope.defaultProtocol = 'http://';
                    $scope.activeItem = null;

                    $scope.setItemActive = function(index) {
                        $scope.activeItem = index;
                        $scope.tile=$scope.searchTiles[index];
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

                    /**
                     * if no protocol is defined we add http to the tile config
                     */
                    $scope.checkProtocol = function() {
                        if($scope.tile.link.indexOf('https://') == 0 ||
                            $scope.tile.link.indexOf('http://') == 0 ||
                            $scope.tile.link.indexOf('chrome://') == 0 ||
                            $scope.tile.link.indexOf('chrome-internals://') == 0 ||
                            $scope.tile.link.indexOf('chrome-extensions://') == 0) {
                        } else {
                            $scope.tile.link = $scope.defaultProtocol + $scope.tile.link;
                        }
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
                    templateUrl: '../html/views/addNewSearchTileDialog.html',
                    targetEvent: ev
                })
                    .then(function (tileConfig) {
                        console.log('ADD TILE TO THE DATABASE', tileConfig.uuid);
                            $rootScope.addUUIDTOList(tileConfig.uuid);
                            $rootScope.$broadcast('addNewTile', tileConfig);
                            analytics.track('addNewSearchTile', 'addTile', {value:tileConfig.link});
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

