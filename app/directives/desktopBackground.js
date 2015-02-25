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
        controller: ['$scope','appSettings','$rootScope', function($scope, appSettings,$rootScope) {

            $scope.changeBg=function(bgoptions) {
                if(bgoptions.imageadd==true) {
                    //set bg image
                    $scope.element.css('background-image', '');
                    $scope.element.css('background-image', bgoptions.image);
                }
                if(bgoptions.cssadd == true) {
                    //set css for background
                    $scope.element.css('background', bgoptions.css);
                }
                /**
                 * load the default images when nothing is set!
                 */
                if(bgoptions.cssadd == false && bgoptions.imageadd == false) {
                    var path = chrome.extension.getURL('/img/materialBG.jpg');
                    $scope.element.css('background-image', '');
                    $scope.element.css('background-image', 'url('+path+')');
                }
            };

            $rootScope.$on('changeBackground', function() {
                appSettings.settings.background()
                    .then(function(bgoptions) {
                        $scope.changeBg(bgoptions);
                    });
            });

            appSettings.settings.background()
                .then(function(bgoptions) {
                    $scope.changeBg(bgoptions);
                });
        }],
        link: function(scope, element, attrs) {
            scope.element = element;
        }

    }
});


