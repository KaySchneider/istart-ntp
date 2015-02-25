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

            function blendColors(c0, c1, p) {
                var f=parseInt(c0.slice(1),16),t=parseInt(c1.slice(1),16),R1=f>>16,G1=f>>8&0x00FF,B1=f&0x0000FF,R2=t>>16,G2=t>>8&0x00FF,B2=t&0x0000FF;
                return "#"+(0x1000000+(Math.round((R2-R1)*p)+R1)*0x10000+(Math.round((G2-G1)*p)+G1)*0x100+(Math.round((B2-B1)*p)+B1)).toString(16).slice(1);
            }
            function shadeColor2(color, percent) {
                var f=parseInt(color.slice(1),16),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
                console.debug(f);
                return "#"+(0x1000000+(Math.round((t-R)*p)+R)*0x10000+(Math.round((t-G)*p)+G)*0x100+(Math.round((t-B)*p)+B)).toString(16).slice(1);
            }
            function componentToHex(c) {
                var hex = c.toString(16);
                return hex.length == 1 ? "0" + hex : hex;
            }
            function rgbToHex(r, g, b) {
                return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
            }

            function calculateBorderColor() {
                console.debug('calculateBorderColor');
                $scope.tileInfo.borderColor = shadeColor2($scope.tileInfo.color,0.5);

            }

            $scope.addBackgroundConfig = function(element) {
                if($scope.tileInfo.color) {
                    if(!$scope.tileInfo.borderColor) {
                        calculateBorderColor();
                    }
                    $scope.element = element;
                    element.css({'background':$scope.tileInfo.color,
                                 "border-color":$scope.tileInfo.borderColor,
                                 "outline-color":$scope.tileInfo.borderColor,
                                 "border-width": '1px',
                                 "border-style": 'solid'});
                    ///element.css('border', $scope.border);
                    //add watcher for live edit mode
                    $scope.$watch('tileInfo.color', function() {
                       $scope.element.css('background', $scope.tileInfo.color+'');

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
        controller: ['$scope', '$rootScope', 'appLauncher','loadpage', '$location', 'liveTileApi',
        function($scope, $rootScope, appLauncher, loadpage, $location, liveTileApi) {
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

            $scope.addBackDropIstartWidgetInternal = function() {
                $scope.removeHandlerIstartBackdropTester =
                    $scope.element.on('click', function($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                        var url = $scope.element.parent().prev().attr('src');
                        liveTileApi.sendClick(url, $scope.element.parent().prev());

                    });
                $scope.$on('$destroy', function() {
                    $scope.element.off('click');//remove the handler
                });
            };
            $scope.launchLink = function() {
                console.log("LOAD");
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
                    scope.addBackDropIstartFullScreenWidget();
                } else {
                    //send the click event to the widget
                    //scope.element = element;
                    //scope.addBackDropIstartWidgetInternal();
                }
            } else if(scope.tileInfo.issearch == true) {
                scope.element = element;
                scope.addBackDropIstartBackdropTesterLink();
            }
        }
    };
});