'use strict';
/**
 * right-scroll
 */

var app = angular.module('istartMetroDirective');

app.directive('rightScroll', function() {
    return {
        restrict: 'A',
        controller: ['$scope','$window',
            function($scope, $window) {
                //check if we had already registered this appId on this scopes events!
                /**
                 * TODO: start here tomorrow morning!
                 */
                var container = document.getElementById('wrap');
                container.addEventListener('mousewheel', function(e) {
                    console.log(e);
                    var wheelDelta = e.wheelDelta || e.wheelDeltaY;
                    if(wheelDelta <= 0) {
                        console.log(window.scrollX);
                        window.scrollTo(window.scrollX-50,0);
                    } else {
                        window.scrollTo(window.scrollX+50,0);
                    }
                });

            }],
        link: function(scope, element, attrs) {

        }

    }
});
