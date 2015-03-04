'use strict';
/**
 * we use this directive to
 * show different app headers and make it much easier to
 * switch between different headers!
 * If much users prefer the new header than we take the new header as standard!
 */

var app = angular.module('istartMetroDirective');

app.directive('appHeader', function() {
    return {
        restrict: 'E',
        templateUrl:'../html/templates/appHeader.html',
        scope:true,
        controller: ['$scope', '$rootScope','$mdSidenav', 'appSettings','analytics', 'internalUrlLoader','$location',
            function($scope, $rootScope, $mdSidenav, appSettings, analytics, internalUrlLoader, $location) {
                $scope.alternate=false;
                $scope.hover=false;
                $scope.menuIconColor='black';
                $scope.menuIconStyle="";
                $scope.toggleMenu = function() {
                    analytics.track('toggleMenu', 'state');
                    $mdSidenav('right').toggle()
                        .then(function(){
                            console.log("OPEN");
                        });
                };
                $scope.closeMenu = function() {
                    $mdSidenav('right').close()
                        .then(function(){
                            console.log("CLOSE");
                        });
                };
                $scope.loadOriginNewTab=function() {
                    internalUrlLoader.ntp();
                };
                $scope.loadBookmarks = function() {
                    internalUrlLoader.bookmarks();
                };
                $scope.loadDownloads = function() {
                    internalUrlLoader.downloads();
                };
                $scope.loadExtensions = function() {
                    //service wich loads interal pages service/interalUrlLoader
                    internalUrlLoader.extensions();
                };
                $scope.go = function(path) {
                    analytics.track('showapps', 'appcenter');
                    $location.path(path);
                };
                $scope.loadSettings=function() {
                    appSettings.settings.header().
                        then(function(headerconfig) {
                            console.log(headerconfig, "HEADER CONFIG");
                            $scope.alternate = headerconfig.alternative;
                            $scope.menuIconColor = headerconfig.menuIconColor;
                            $scope.menuIconStyle = {color:'"'+$scope.menuIconColor+'"',
                                                    width: headerconfig.menuDimension.w + 'px',
                                                    height:headerconfig.menuDimension.h +'px'};
                        });
                };
                $scope.$watch('editMode', function() {
                    //$scope.$parent.editMode=$scope.editMode;
                    console.log($scope, "EDIT", $scope.editMode);

                });
                $scope.changed = function(mode) {
                    $scope.$parent.editMode=mode;
                };
                //check if we had already registered this appId on this scopes events!
                $rootScope.$on('globalHeaderChanged', function() {
                        $scope.loadSettings();
                });
                $scope.loadSettings();

            }],
        link: function(scope, element, attrs) {

        }

    }
});


