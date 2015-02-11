/**
 * Created by ikay on 28.01.15.
 */
    //istart-calc-screen-size
'use strict';
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('istartCalcScreenSize', function() {
    return {
        restrict: 'A',
        controller: ['$scope', '$window', 'getWindowHeight', function($scope, $window, getWindowHeight) {
            $scope.height = getWindowHeight.height;
            angular.element($window).bind('resize', function() {
                $scope.setElementNewWidth();
            });
            $scope.setElementNewWidth = function() {
                angular.element($scope.element).css('height', $($window.top).height()-4 + 'px');
            };
        }],
        link: function(scope, element, attrs) {
            scope.element = element[0];
            scope.setElementNewWidth();
        }

    }
}).directive('hideTopScroll', function() {
    return {
        restrict: 'A',
        scope:true,
        controller: ['$scope', '$window', function($scope, $window) {
            $scope.hide = false;
        }],
        link: function(scope, element, attrs) {
            angular.element(element).on('click', function() {
                //scroll to top
                console.log('you clicked to top');
                scope.prev.animate({scrollTop: scope.prev.offset().top}, "slow");
            });
            scope.prev = angular.element(element).prev();
            angular.element(angular.element(element).prev()).on('scroll', function() {
                //console.log(angular.element(element).parent()[0].scrollTop);
                if(angular.element(element).prev()[0].scrollTop > 165) {
                    scope.hide = true;
                } else {
                    scope.hide = false;
                }
                scope.$apply();
                //console.log('scroll',   angular.element(element).parent()[0].scrollTop);
            });
        }
    }
});

