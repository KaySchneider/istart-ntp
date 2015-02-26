'use strict';
/**
 * right-scroll
 */

var app = angular.module('istartMetroDirective');

app.directive('rightScroll', function() {
    return {
        restrict: 'A',
        controller: ['$scope', '$rootScope','$window','appSettings',
            function($scope, $rootScope ,$window, appSettings) {
                //check if we had already registered this appId on this scopes events!
                /**
                 * TODO: start here tomorrow morning!
                 */

                var container = document.getElementById('wrap');
                var mouseHandler = null;
                var settings = false;

                $scope.addMouseWheelSupport = function() {
                    container.addEventListener('mousewheel', function(e) {
                        if(settings===true) {
                            var wheelDelta = e.wheelDelta || e.wheelDeltaY;
                            if(wheelDelta <= 0) {
                                window.scrollTo(window.scrollX-50,0);
                            } else {
                                window.scrollTo(window.scrollX+50,0);
                            }
                        }

                    });
                };

                $rootScope.$on('mouseWheelSettingsChanged', function() {
                    $scope.setMouseWheelSupport();
                });

                $scope.setMouseWheelSupport = function() {
                    appSettings.settings.mouseWheel().then(function(mouseWheelSettings) {
                        console.log(mouseWheelSettings);
                        if(mouseWheelSettings.active === true) {
                            settings=true;
                        } else {
                            settings=false;
                        }
                    });
                };
                $scope.setMouseWheelSupport();
                $scope.addMouseWheelSupport();

            }]
    }
});
