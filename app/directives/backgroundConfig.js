'use strict';
/**
 * reads the tileInfo config and sets the background color!
 *
 */
var app = angular.module('istartMetroDirective');
app.directive('backgroundConfig', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
//            console.log(scope.tileInfo);
            if(scope.tileInfo.color) {
                angular.element(element).css('background', scope.tileInfo.color);
            }
        }

    };
})
.directive('istartBackdopTester', function() {
    return {
        restrict: 'A',
        controller: ['$scope', '$rootScope', 'appLauncher','loadpage',
        function($scope, $rootScope, appLauncher, loadpage) {
            $scope.addBackDropIstartBackdropTesterApp = function() {
                $scope.removeHandlerIstartBackdropTester = angular.element($scope.element[0]).on('click', function() {
                    $scope.launchApp();
                });
                $scope.$on('$destroy', function() {
                    angular.element($scope.element[0]).off('click');//remove the handler
                });

            };

            $scope.addBackDropIstartBackdropTesterLink = function() {
                $scope.removeHandlerIstartBackdropTester = angular.element($scope.element[0]).on('click', function() {
                    $scope.launchLink();
                });
                $scope.$on('$destroy', function() {
                    angular.element($scope.element[0]).off('click');//remove the handler
                });
            };

            $scope.launchLink = function() {
                loadpage.loadPage($scope.tileInfo.link)
                    .then(function(result) {
                        console.log(result);
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
                        console.log(res, 'app launcher');
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
            }
        }
    };
});