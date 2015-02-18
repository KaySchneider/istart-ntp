'use strict';
/**
 * reads the tileInfo config and sets the background color!
 *
 */
var app = angular.module('istartMetroDirective');
app.directive('backgroundConfig', function() {
    return {
        restrict: 'A',
        controller: ['$scope',function($scope) {

            $scope.addBackgroundConfig = function(element) {
                if($scope.tileInfo.color) {
                    $scope.element = element;
                    angular.element(element).css('background', $scope.tileInfo.color);
                    //add watcher for live edit mode
                    $scope.$watch('tileInfo.color', function() {
                        angular.element($scope.element).css('background', $scope.tileInfo.color+'');
                    });
                }
            }
        }],
        link: function(scope, element) {
              scope.addBackgroundConfig(element);
        }

    };
})
.directive('istartBackdopTester', function() {
    return {
        restrict: 'A',
        controller: ['$scope', '$rootScope', 'appLauncher','loadpage', '$location',
        function($scope, $rootScope, appLauncher, loadpage, $location) {
            $scope.addBackDropIstartBackdropTesterApp = function() {
                $scope.removeHandlerIstartBackdropTester = $scope.element.on('click', function() {
                  if($scope.editMode !== true) {
                    $scope.launchApp();
                  }
                });
                $scope.$on('$destroy', function() {
                    $scope.element.off('click');//remove the handler
                });

            };

            $scope.addBackDropIstartBackdropTesterLink = function() {
                $scope.removeHandlerIstartBackdropTester = $scope.element.on('click', function() {
                    if($scope.editMode !== true) {
                        $scope.launchLink();
                    }
                });
                $scope.$on('$destroy', function() {
                    $scope.element.off('click');//remove the handler
                });
            };

            $scope.addBackDropIstartFullScreenWidget = function() {
                $scope.removeHandlerIstartBackdropTester =
               $scope.element.on('click', function($event) {

                    $location.url('/fullscreen/'+$scope.tileInfo.extensionid);
                });
                $scope.$on('$destroy', function() {
                    $scope.element.off('click');//remove the handler
                });
            };

            $scope.launchLink = function() {
                loadpage.loadPage($scope.tileInfo.link)
                    .then(function(result) {
                        //console.log(result);
                    });
            };

            $scope.launchApp = function() {
                /**
                 * TODO: add google tracking code here
                 * TO TRACK ON WICH PAGE THE USER STARTS THE APPS
                 */
                appLauncher
                    .launch({id:$scope.tileInfo.appid})
                    .then(function(res) {
                        //console.log(res, 'app launcher');
                });
            };
        }],
        link: function(scope, element, attrs) {
            if(scope.tileInfo.app == true) {
                scope.element = element;
                scope.addBackDropIstartBackdropTesterApp();
            } else if(scope.tileInfo.link) {
                scope.element = element;
                scope.addBackDropIstartBackdropTesterLink();
            } else if(scope.tileInfo.iswidget == true) {
                if( typeof scope.tileInfo.fullscreen != "undefined") {
                    scope.element = element;
                    console.log('add add');
                    scope.addBackDropIstartFullScreenWidget();
                }
            }
        }
    };
});