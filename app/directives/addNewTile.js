'use strict';
var app = angular.module('istartMetroDirective');
app.directive('addNewTile', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: {
            tile:'=tile'
        }, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', function ($scope, $mdDialog, $rootScope) {
            var ps = $scope;
            $scope.edit=false;
            $scope.DialogController = ['$scope', '$mdDialog', '$window',
                function($scope, $mdDialog, $window) {
                    console.log($scope);
                $scope.edit = ps.edit;
                $scope.defaultProtocol = 'http://';
                    if($scope.edit==false) {
                        $scope.tile={
                            label:'',
                            link:'http://',
                            color: '#b81c46',
                            w: 1,
                            h: 1,
                            uuid: $window.guid()
                        };
                    } else {
                        $scope.tile = ps.tile;
                    }
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    $mdDialog.cancel();
                };
                $scope.answer = function(answer) {
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

                $scope.CheckLabel = function() {    };

                /**
                 * check the current tiles configuration
                 */
                $scope.checkconfig = function() {
                    $scope.checkProtocol();
                    if(typeof $scope.tile.label != 'undefined') {
                        var trimmed = $scope.tile.label.trim();
                        if(trimmed.length >=1) {
                            $scope.tile.label =  trimmed;
                            $mdDialog.hide($scope.tile);
                        }
                    }
                };

            }];
            $scope.showAdvanced = function (ev) {
                $mdDialog.show({
                    controller: $scope.DialogController,
                    templateUrl: '../html/views/addNewTileDialog.html',
                    targetEvent: ev
                })
                    .then(function (tileConfig) {
                        if($scope.edit==true) {

                        } else {
                            $rootScope.$broadcast('addNewTile', tileConfig);
                        }
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
