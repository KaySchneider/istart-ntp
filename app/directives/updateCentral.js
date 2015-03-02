'use strict';
/**
 * This will shown up on major updates to inform
 * the user that some things will be changed.
 * TODO: implement here an option that the user can discard the update
 * and use the old version!!!
 */
var app = angular.module('istartMetroDirective');
app.directive('updateCentral', function() {
    return {
        restrict: 'E',
        scope: true,
        template: '<div class="updateinfo" ng-show="onUpdate==true" layout="row" layout-align="center center"><div class="inner"  flex="55"><md-content ><md-button ng-click="closethis()">close</md-button>' +
                    '<h2>Update information</h2><p>Hey, thanks for using iStart. This is the new update center Where i want inform you about new features like today.' +
                    ' Now you can activate the Global Search. Search Bookmarks, apps or tiles' +
                    ' direct on the iStart new tab page :). You can activate this new <b>experimental</b> feature on the settings section of iStart. Or just toggle this' +
                    ' button. to activate the new search feature</p>' +
                    ' <md-switch ng-model="searchToggle" class="md-primary" md-no-ink aria-label="Turn non/off global search">' +
                     ' global Search  {{searchToggle}}' +
                    '</md-switch>' +
                    '<md-button class="md-raised md-primary" ng-click="closethis()" layout-align="center center"> x close </md-button></md-content></div></div>',
        controller: ['$scope','appSettings','$compile', 'analytics',
            function($scope, appSettings, $compile, analytics) {
                //check if we had already registered this appId on this scopes events!
                $scope.currUpdateCenter = "2.0.1.57";
                $scope.onUpdate=false;

                $scope.messages =$compile()($scope);
                $scope.message = $scope.messages.html();
                $scope.searchToggle=false;
                $scope.closethis = function() {
                    $scope.onUpdate=false;
                };
                appSettings.settings.updateCenter()
                    .then(function(settings) {
                        if(settings.version != $scope.currUpdateCenter) {
                                 $scope.onUpdate=true;
                                 appSettings.settings.setUpdateCenter(true, $scope.currUpdateCenter);
                                 $scope.$watch('searchToggle', function(settings) {
                                    appSettings.settings.setGlobalSearch($scope.searchToggle);
                                    analytics.track('activateSearch', 'update', {value:$scope.searchToggle});
                                 });
                                 appSettings.settings.globalSearch().then(
                                     function(settings) {
                                        $scope.searchToggle=settings.active;
                                     }
                                 );
                            analytics.track('showupdatecenter', 'update', {value:$scope.currUpdateCenter});
                        }
                    });
            }],
        link: function(scope, element, attrs) {

        }

    }
});


