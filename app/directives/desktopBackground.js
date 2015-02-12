'use strict';
/**
 * Created by ikay on 12.01.15.
 */
/**
 * this part of the app holds the simple metro item
 * template and behaviour
 */

var app = angular.module('istartMetroDirective');

app.directive('desktopBackground', function() {
    return {
        restrict: 'A',
        scope: true,//nested child scope
        controller: ['$scope','appSettings', function($scope, appSettings) {
            appSettings.settings.background()
                .then(function(bgoptions) {
                    if(bgoptions.imageadd==true) {
                        //set bg image
                        $scope.element.css('background-image', bgoptions.image);
                    }
                    if(bgoptions.cssadd == true) {
                        //set css for background
                        $scope.element.css('background', bgoptions.css);
                    }

                });
        }],
        link: function(scope, element, attrs) {
            scope.element = element;
        }

    }
});


