'use strict';
var app = angular.module('istartMetroDirective');
app.directive('addNewTile', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: {
            tile:'=tile'
        }, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', function ($scope, $mdDialog, $rootScope, $window) {
            var ps = $scope;
            $scope.edit = false;

            $scope.DialogController = ['$scope', '$mdDialog', '$window','$rootScope',
                function($scope, $mdDialog, $window,$rootScope) {
                    console.log($scope);
                $scope.configCopy = null;
                $scope.edit = ps.edit;
                $scope.tldconf=false;
                //$scope.edit=false;
                $scope.defaultProtocol = 'http://';
                    if($scope.edit==false) {
                        $scope.tile={
                            label:'',
                            link:'http://',
                            color: '#b81c46',
                            w: 1,
                            h: 1,
                            uuid:  $rootScope.getUniqueUUID()
                        };
                    } else {

                        if(ps.tile.config) {
                            if(ps.tile.config.useredit) {
                                $scope.tldconf = (ps.tile.config.useredit.indexOf('tld') ? false: true);
                                console.log($scope.tldconf, ('tld' in ps.tile.config.useredit), ps.tile.config.useredit);
                                console.log(ps.tile.config.tld);
                            }
                        }
                        $scope.configCopy = angular.copy(ps.tile);
                        $scope.tile = ps.tile;
                    }
                $scope.hide = function() {
                    $mdDialog.hide();
                };
                $scope.cancel = function() {
                    console.log('DIALOG CANCEL')
                    if($scope.edit != false) {
                         console.log($scope.configCopy, ps.tile);
                         ps.tile = angular.copy($scope.configCopy, ps.tile);
                         //ps.tile = angular.copy($scope.configCopy);
                        //ps.tile = $scope.configCopy;
                    }
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
                    if($scope.tile.iswidget==true||$scope.tile.issearch==true){
                        $mdDialog.hide($scope.tile);
                    }else {
                        $scope.checkProtocol();
                        if(typeof $scope.tile.label != 'undefined') {
                            var trimmed = $scope.tile.label.trim();
                            if(trimmed.length >=1) {
                                $scope.tile.label =  trimmed;
                                $mdDialog.hide($scope.tile);
                            }
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
                            var event = new Event('resort');
                            window.dispatchEvent(event);
                        } else {
                            $rootScope.addUUIDTOList(tileConfig.uuid);
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
