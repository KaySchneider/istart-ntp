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
        //templateUrl:'../html/templates/editTileBottom.html',
        controller:['$scope', '$rootScope','$mdBottomSheet', function($scope, $rootScope, $mdBottomSheet) {
            $rootScope.$watch('editBottom', function($event) {
                if($rootScope.editBottom===true) {
                    $scope.showGridBottomSheet($event);
                }
            });
            var ps = $scope;
            $scope.showGridBottomSheet = function($event) {
                $scope.alert = '';
                $mdBottomSheet.show({
                    templateUrl: '../html/templates/editTileBottom.html',
                    controller: ['$scope','$mdBottomSheet', '$rootScope','$mdDialog','i18n', 'analytics',
                        function($scope, $mdBottomSheet, $rootScope, $mdDialog, i18n, analytics) {
                        analytics.track('editTile', 'editTile');
                        $scope.tileSizes = [
                            {label:'large', value:{h:2,w:2}},
                            {label:'medium', value:{h:1,w:2}},
                            {label:'small', value:{h:1,w:1}}
                        ];
                        $scope.cancel = function() {
                            $rootScope.editTileInfo = angular.copy($scope.configCopy, $rootScope.editTileInfo);
                            $mdBottomSheet.cancel();
                        };

                        $scope.tldconf=false;
                        $scope.tldcheck = null;
                        $scope.sizeCheck = null;

                        //$scope.edit=false;
                        $scope.checkCurr = function(selectIndex) {
                            $scope.tldcheck = selectIndex;
                        };

                        $scope.checkCurrSize = function(selectedIndex) {
                            $scope.sizeCheck = selectedIndex;
                            $scope.tileInfo.w = $scope.sizeCheck.value.w;
                            $scope.tileInfo.h = $scope.sizeCheck.value.h;
                        };

                        $scope.initSize=function() {
                            if($rootScope.editTileInfo.w==2&&$rootScope.editTileInfo.h==2) {
                                $scope.sizeCheck=$scope.tileSizes[0];
                            } else if ($rootScope.editTileInfo.w==2&&$rootScope.editTileInfo.h==1) {
                                $scope.sizeCheck=$scope.tileSizes[1];
                            } else if ($rootScope.editTileInfo.w==1&&$rootScope.editTileInfo.h==1) {
                                $scope.sizeCheck=$scope.tileSizes[2];
                            }
                        };

                        $scope.buildTldDropDownData=function() {
                            var config = [];
                            for(var i in $rootScope.editTileInfo.config.tld) {
                                config.push({label: $rootScope.editTileInfo.config.tld[i],
                                            value:$rootScope.editTileInfo.config.tld[i]});
                            }
                            $scope.dropDownTld=config;
                            $scope.tldcheck =   $scope.dropDownTld[
                                                    $scope.getDefaultSelectedValue($rootScope.editTileInfo.config.tld,
                                                                                   $rootScope.editTileInfo.defaultld)
                                                    ];
                        };

                        $scope.removeItem = function(ev,tileInfo) {
                            var name= (tileInfo.label ? tileInfo.label :tileInfo.name);
                            var confirm = $mdDialog.confirm()
                                .title('Delete the tile: ' + name)
                                .content(i18n.chrome.getMessage('delete_message'))
                                .ariaLabel('DELETE TILE')
                                .ok('Delete')
                                .cancel('cancel')
                                .targetEvent(ev);
                            $mdDialog.show(confirm).then(function() {
                                $rootScope.$broadcast('removeTile', tileInfo);
                                $mdBottomSheet.cancel();
                            }, function() {
                            });
                        };

                        $scope.getDefaultSelectedValue=function(originalSource, selectedItemVal) {
                            return originalSource.indexOf(selectedItemVal);
                        };

                        /**
                         * if no protocol is defined we add http to the tile config
                         */
                        $scope.checkProtocol = function() {
                            if($scope.tileInfo.link.indexOf('https://') == 0 ||
                                $scope.tileInfo.link.indexOf('http://') == 0 ||
                                $scope.tileInfo.link.indexOf('chrome://') == 0 ||
                                $scope.tileInfo.link.indexOf('chrome-internals://') == 0 ||
                                $scope.tileInfo.link.indexOf('chrome-extensions://') == 0) {
                            } else {
                                $scope.tileInfo.link = $scope.defaultProtocol + $scope.tileInfo.link;
                            }
                        };

                        /**
                         * check the current tiles configuration
                         */
                        $scope.checkconfig = function() {
                            if($scope.tileInfo.iswidget==true||$scope.tileInfo.issearch==true){

                                if($scope.tldcheck) {
                                    //write back the tld config to the search item
                                    $scope.tileInfo.config.defaultld  =$scope.tldcheck.value;
                                }
                                $mdBottomSheet.hide($scope.tileInfo);

                            }else {
                                $scope.checkProtocol();
                                if(typeof $scope.tileInfo.label != 'undefined') {
                                    var trimmed = $scope.tileInfo.label.trim();
                                    if(trimmed.length >=1) {
                                        $scope.tileInfo.label =  trimmed;
                                        $mdBottomSheet.hide($scope.tileInfo);
                                    }
                                }
                            }
                        };


                        //check if the tile has an extended config object in it!
                        if($rootScope.editTileInfo.config) {
                            if($rootScope.editTileInfo.config.useredit) {
                                $scope.tldconf = ($rootScope.editTileInfo.config.useredit.indexOf('tld') ? false: true);
                                if(!$rootScope.editTileInfo.config.defaultld || typeof $rootScope.editTileInfo.config.defaultld == "undefined") {
                                    $rootScope.editTileInfo.config.defaultld = $rootScope.editTileInfo.config.tld[0];
                                }
                                $scope.buildTldDropDownData();
                            }
                        }

                        $scope.initSize();
                        //copy the tiles settings so that we can switch the old settings back on abbort dialog!
                        $scope.configCopy = angular.copy($rootScope.editTileInfo);
                        $scope.tileInfo = $rootScope.editTileInfo;

                    }],
                    targetEvent: $event
                }).then(function(tileConfig) {
                    $scope.editBottom=false;
                    var event = new Event('resort');
                    window.dispatchEvent(event);
                });
            };
        }],
        link: function(scope, element, attrs) {

        }

    }
})
.factory('globalEditTile',['$rootScope',
        function($rootScope) {
            var state=false;
            var tileInfo=null;
            function show(tileInfo) {
                state=true;
                tileInfo=tileInfo;
            }

            function hide() {

            }


            return //return here some methods
        }
]);

