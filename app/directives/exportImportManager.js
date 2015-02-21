'use strict';
/**
 * export import items direct from the directive
 * We need an new window to do this!
 * created by kay
 */
var app = angular.module('istartMetroDirective');
app.directive('exportImportManager', function() {
    return {
        restrict: 'A',//set your own click handler
        scope: true, //use own scope
        controller: ['$scope', '$mdDialog', '$rootScope', '$window', '$q', '$http', 'analytics',

            function ($scope, $mdDialog, $rootScope, $window, $q, $http, analytics ) {
                var ps = $scope;
                $scope.DialogController = ['$scope', '$mdDialog', '$window','analytics', 'matrix','i18n',
                    function($scope, $mdDialog, $window, analytics,matrix,i18n) {
                        $scope.downloadFile=false;
                        $scope.importResult=false;
                        $scope.importDone=false;
                        $scope.matrixForImport = null;
                        $scope.prevIndexOuter=0;
                        $scope.prevIndexInner=0;
                        $scope.generateExportFile = function() {
                            var fileHeader = "data:application/octet-stream;charset=utf-16le;base64,";
                            var encodedData = window.btoa($scope.exportMatrix);
                            $scope.downloadFile = fileHeader + encodedData;
                            window.open($scope.downloadFile);
                        };

                        $scope.importAndSave = function() {
                          matrix.writeBackImport($scope.matrixForImport)
                              .then(function(result) {
                                  console.log(result, 'IMPORTED ITEMS');
                                  $scope.importDone=true;
                              });
                        };

                        $scope.nextPreview = function($event) {
                            $event.preventDefault();
                            if($scope.prevIndexInner +1 > $scope.matrixForImport[$scope.prevIndexOuter].length -1 ) {
                                if($scope.prevIndexOuter +1 <= $scope.matrixForImport.length -1) {
                                    $scope.prevIndexOuter +=1;
                                    $scope.prevIndexInner=0;
                                }
                            } else {
                                $scope.prevIndexInner += 1;
                            }
                            $scope.currItem=$scope.matrixForImport[$scope.prevIndexOuter][$scope.prevIndexInner][0];
                        };

                        $scope.prev = function($event) {
                            $event.preventDefault();
                            if($scope.prevIndexInner - 1 < 0 ) {
                                if($scope.prevIndexOuter - 1  >= 0 ) {
                                    $scope.prevIndexOuter -=1;
                                    $scope.prevIndexInner= $scope.matrixForImport[$scope.prevIndexOuter].length-1;
                                }
                            } else {
                                $scope.prevIndexInner -= 1;
                            }
                            $scope.currItem=$scope.matrixForImport[$scope.prevIndexOuter][$scope.prevIndexInner][0];
                        };
                        $scope.checkImport = function() {
                            $scope.importResult==false;
                            $scope.importError=false;
                            $scope.resultMessage=false;
                            var result = matrix.checkImportMatrix($scope.importMatrix);
                            if(result==false) {
                                $scope.importError = true;//set the error to true and tell the user that something went wrong!
                            }
                            $scope.importResult=true;
                            if($scope.importError===true) {
                                $scope.resultMessage = i18n.chrome.getMessage('error');
                            } else if(result === true) {
                                /**
                                 * show simple preview of the first item!
                                 */
                                $scope.matrixForImport=matrix.getImportTempMatrix();
                                $scope.resultMessage = "Check your data";
                                $scope.currItem=$scope.matrixForImport[$scope.prevIndexOuter][$scope.prevIndexInner][0];
                            }

                        };
                        
                        analytics.track('importExportItems', 'system');
                        $scope.loadSearchTilesConfig = function() {
                            var deferred = $q.defer();
                            deferred.resolve(systemLiveTiles.items);
                            return deferred.promise;
                        };
                        $scope.exportMatrix = null;
                        $scope.importMatrix = null;

                        matrix.getLocalData()
                            .then(function(data) {
                                $scope.exportMatrix = JSON.stringify(data);
                            });

                        $scope.hide = function() {
                            $mdDialog.hide();
                        };
                        $scope.cancel = function() {
                            $mdDialog.cancel();
                        };
                        $scope.answer = function(answer) {
                            $mdDialog.hide(answer);
                        };
                    }];
                $scope.showAdvanced = function (ev) {
                    $mdDialog.show({
                        controller: $scope.DialogController,
                        templateUrl: '../html/views/importExportDialog.html',
                        targetEvent: ev
                    })
                        .then(function (tileConfig) {
                           console.log('CLSOE ME');
                        }, function () {
                            //do nothing when cancel
                        });
                }
            }],
        link: function(scope, element, attrs) {
            /**
             * TODO: add edit mode for tiles
             */
            angular.element(element).on('click', function($event) {
                scope.showAdvanced($event);
            });
        }
    }
});


